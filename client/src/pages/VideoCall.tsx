import { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import { Camera, Mic, VideoOff, MicOff, PhoneOff, User as UserIcon, Maximize, Copy, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export default function VideoCall() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const appointmentRoom = location.state?.roomId || null;

  const [stream, setStream] = useState(null);
  const [callReceived, setCallReceived] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [isLocalMain, setIsLocalMain] = useState(false);
  const [copied, setCopied] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const socketRef = useRef();
  const peerConnectionRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');

  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    const currentRoom = appointmentRoom || sessionStorage.getItem('videoRoom') || `${user?._id}_therapy_room`;
    setRoomId(currentRoom);

    socketRef.current = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}`);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error("Media permission denied or no devices", err);
      });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_room', currentRoom);
    });

    socketRef.current.on('webrtc_offer', async ({ signal }) => {
      setCallReceived(true);
      sessionStorage.setItem('pendingOffer', JSON.stringify(signal));
    });

    socketRef.current.on('webrtc_answer', async ({ signal }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
      }
    });

    socketRef.current.on('webrtc_ice_candidate', async ({ candidate }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding ice candidate", e);
        }
      }
    });

    socketRef.current.on('webrtc_end_call', () => {
      endCall(false);
    });

    return () => {
      socketRef.current?.disconnect();
      peerConnectionRef.current?.close();
    };
  }, [user, appointmentRoom]);

  useEffect(() => {
     return () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
     }
  }, [stream]);

  useEffect(() => {
    if (stream && myVideo.current) {
      myVideo.current.srcObject = stream;
    }
    if (remoteStream && userVideo.current && callAccepted) {
      userVideo.current.srcObject = remoteStream;
    }
  }, [stream, remoteStream, isLocalMain, callAccepted]);

  const initPeerConnection = () => {
    const pc = new RTCPeerConnection(rtcConfig);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('webrtc_ice_candidate', { room: roomId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    peerConnectionRef.current = pc;
    return pc;
  };

  const startCall = async () => {
    const pc = initPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current.emit('webrtc_offer', { room: roomId, signal: offer });
    setCallAccepted(true);
  };

  const answerCall = async () => {
    setCallAccepted(true);
    const pc = initPeerConnection();
    
    const offerSignal = sessionStorage.getItem('pendingOffer');
    if (offerSignal) {
      await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offerSignal)));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current.emit('webrtc_answer', { room: roomId, signal: answer });
      sessionStorage.removeItem('pendingOffer');
    }
  };

  const endCall = (emit = true) => {
    setCallEnded(true);
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (remoteStream) remoteStream.getTracks().forEach(track => track.stop());
    peerConnectionRef.current?.close();
    if (emit) {
       socketRef.current.emit('webrtc_end_call', { room: roomId });
    }
    setTimeout(() => navigate('/profile'), 1500);
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !micOn;
      setMicOn(!micOn);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !videoOn;
      setVideoOn(!videoOn);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-h-[900px] bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Live Session</h2>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
            Room: {roomId.slice(0, 8)}...
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyRoomId}>
                {copied ? <CheckCircle2 className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
            </Button>
        </div>
      </div>

      {/* Video Content Container */}
      <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center">
          
          {/* Main Fullscreen Video */}
          <div className="absolute inset-0 z-0">
              {isLocalMain ? (
                  stream && videoOn ? (
                    <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover transform -scale-x-100" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                       <UserIcon size={64} className="mb-4 opacity-50" />
                       <p>Camera is off</p>
                    </div>
                  )
              ) : (
                  callAccepted && !callEnded ? (
                    <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-8 text-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center animate-pulse">
                            <UserIcon size={40} className="opacity-50" />
                        </div>
                        {callReceived && !callAccepted ? (
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Incoming Call...</h3>
                                <Button onClick={answerCall} className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 shadow-lg shadow-teal-500/20">
                                    Join Session
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Waiting for other participant...</h3>
                                <p className="mb-6">They will join the session shortly.</p>
                                {!callAccepted && (
                                    <Button onClick={startCall} className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8">
                                        Start Session
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                  )
              )}
          </div>

          {/* Picture-in-Picture (Small Video) */}
          <motion.div 
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.2}
            className="absolute top-6 right-6 w-32 sm:w-48 aspect-[3/4] sm:aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 z-20 cursor-move transition-transform"
          >
             {isLocalMain ? (
                 callAccepted && !callEnded ? (
                    <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500"><UserIcon size={32} /></div>
                 )
             ) : (
                 stream && videoOn ? (
                    <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover transform -scale-x-100" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500"><UserIcon size={32} /></div>
                 )
             )}
             
             {/* PIP Flip Button */}
             <button 
                onClick={() => setIsLocalMain(!isLocalMain)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 p-1.5 rounded-lg backdrop-blur text-white transition-colors"
             >
                <Maximize size={14} />
             </button>
             
             {/* Name Tag */}
             <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-medium">
                 {isLocalMain ? "Remote" : "You"}
             </div>
          </motion.div>

          {/* Controls Overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl z-20">
             <Button
                variant={micOn ? "secondary" : "destructive"}
                size="icon"
                onClick={toggleMic}
                className={`rounded-full w-12 h-12 ${micOn ? 'bg-white/10 hover:bg-white/20 text-white' : ''}`}
             >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
             </Button>

             <Button
                variant={videoOn ? "secondary" : "destructive"}
                size="icon"
                onClick={toggleVideo}
                className={`rounded-full w-12 h-12 ${videoOn ? 'bg-white/10 hover:bg-white/20 text-white' : ''}`}
             >
                {videoOn ? <Camera size={20} /> : <VideoOff size={20} />}
             </Button>

             <div className="w-px h-8 bg-white/20 mx-2" />

             <Button
                variant="destructive"
                onClick={() => endCall(true)}
                className="rounded-full px-6 h-12 bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20 text-white font-semibold"
             >
                <PhoneOff size={20} className="mr-2" /> End Call
             </Button>
          </div>
      </div>
    </div>
  );
}
