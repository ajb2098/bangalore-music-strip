// Lightbox.jsx - Simple video lightbox
import React from 'react';
import './Lightbox.css';

const Lightbox = ({ videoIndex, onClose }) => {
  console.log(`🔍 Lightbox received videoIndex: ${videoIndex}`);
  
  if (!videoIndex) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="lightbox-overlay" onClick={handleBackdropClick}>
      <video 
        autoPlay 
        controls 
        className="lightbox-video"
        preload="auto"
        playsInline
        muted={false}
      >
        <source src={`/video/${videoIndex}.mp4?v=${Date.now()}`} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
        <source src={`/video/${videoIndex}.mp4?v=${Date.now()}`} type="video/mp4" />
        <source src={`/video/${videoIndex}.webm?v=${Date.now()}`} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <button className="lightbox-close" onClick={onClose}>✕</button>
    </div>
  );
};

export default Lightbox;
