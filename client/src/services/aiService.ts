import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/ai`;

export const getCompanionReply = async (message: string) => {
  try {
    const response = await axios.post(`${API_URL}/companion`, { message });
    return response.data.reply;
  } catch (error) {
    console.error("Error getting AI companion reply:", error);
    throw error;
  }
};
