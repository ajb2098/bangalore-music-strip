import React from 'react';
import { useGlobalAudio } from './GlobalAudioContext.jsx';

const VolumeButton = ({ theme = 'dark' }) => {
  const { toggleMute, isMuted } = useGlobalAudio();

  // Theme-based styling
  const isDark = theme === 'dark';
  const borderColor = isDark 
    ? 'rgba(255, 255, 255, 0.3)' 
    : 'rgba(0, 0, 0, 0.3)';
  const borderColorHover = isDark 
    ? 'rgba(255, 255, 255, 0.6)' 
    : 'rgba(0, 0, 0, 0.6)';
  const textColor = isDark 
    ? 'rgba(255, 255, 255, 0.8)' 
    : 'rgba(0, 0, 0, 0.8)';
  const textColorHover = isDark 
    ? 'rgba(255, 255, 255, 1)' 
    : 'rgba(0, 0, 0, 1)';
  const hoverBackground = isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.05)';

  const handleMouseEnter = (e) => {
    e.target.style.borderColor = borderColorHover;
    e.target.style.color = textColorHover;
    e.target.style.background = hoverBackground;
  };

  const handleMouseLeave = (e) => {
    e.target.style.borderColor = borderColor;
    e.target.style.color = textColor;
    e.target.style.background = 'transparent';
  };

  return (
    <button
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        width: 28,
        height: 28,
        background: 'transparent',
        border: `1px solid ${borderColor}`,
        borderRadius: 4,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        zIndex: 1000,
        transition: 'all 0.15s ease',
        backdropFilter: 'blur(8px)',
        color: textColor,
      }}
      onClick={toggleMute}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
    >
      {isMuted ? '×' : '○'}
    </button>
  );
};

export default VolumeButton;
