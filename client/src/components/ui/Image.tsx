import React, { useState, useEffect } from 'react';
import { Skeleton } from './skeleton';
import { motion } from 'framer-motion';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=800';

export const Image = ({
  src,
  alt,
  className,
  fallback = FALLBACK_IMAGE,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect( () => {
    setImgSrc(src || fallback);
    setHasError(false);
    setIsLoaded(false);
  }, [src, fallback]);

  return (
    <div className={`relative overflow-hidden inline-block flex-shrink-0 ${className || ""}`}>
      {!isLoaded && <Skeleton className="absolute inset-0 w-full h-full rounded-[inherit] z-0" />}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        src={imgSrc}
        alt={alt}
        className={`object-cover w-full h-full relative z-10 block`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImgSrc(fallback);
          }
        }}
        {...props}
      />
    </div>
  );
}; 
