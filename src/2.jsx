import React, { useState, useEffect } from 'react'
import { useGlobalAudio } from './GlobalAudioContext.jsx'

const INTRO_STYLE = {
  btnText: 'Continue',
  btnWidth: 200,
  btnHeight: 58,
  btnX: 5,
  btnY: -19,
  btnScale: 0.69,
  btnOpacity: 1,
  btnTextColor: '#312d2f',
  titleX: 15,
  titleY: 14,
  titleScale: 1,
  titleColor: '#ffffff',
  subtitleX: 4,
  subtitleY: 0,
  subtitleScale: 1,
  subtitleColor: '#ffffff',
};

const IntroPage = ({ onFinish }) => {
  const [hidden, setHidden] = useState(false)
  const { updateVolumeForPage, toggleMute, isMuted } = useGlobalAudio();

  // Update volume for this page
  useEffect(() => {
    updateVolumeForPage('intro2');
  }, [updateVolumeForPage]);

  // Hide page and call onFinish when button is clicked
  const handleStart = () => {
    setHidden(true)
    if (onFinish) onFinish()
  }

  if (hidden) return null

  return (
    <div className="introloader-root">
      <div className="introloader-overlay" />
      <div className="introloader-content">
        <div
          className="introloader-subtitle"
          style={{
            transform: `translate(${INTRO_STYLE.subtitleX}px, ${INTRO_STYLE.subtitleY}px) scale(${INTRO_STYLE.subtitleScale})`,
            color: INTRO_STYLE.subtitleColor,
            transition: 'all 0.2s',
          }}
        >
          Even the smallest, most forgotten objects know the weight of history. In their silences, they wait.
          <br /><br />
          -for someone to <strong>listen</strong>, to <strong>remember</strong>, to <strong>reimagine</strong>
        </div>
        <button
          className="introloader-btn"
          onClick={handleStart}
          style={{
            width: INTRO_STYLE.btnWidth,
            height: INTRO_STYLE.btnHeight,
            transform: `translate(${INTRO_STYLE.btnX}px, ${INTRO_STYLE.btnY}px) scale(${INTRO_STYLE.btnScale})`,
            opacity: INTRO_STYLE.btnOpacity,
            transition: 'all 0.2s',
          }}
        >
          <span className="introloader-btn-text" style={{ color: INTRO_STYLE.btnTextColor }}>{INTRO_STYLE.btnText}</span>
        </button>

        {/* Volume Button - Consistent Minimal UI */}
        <button
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            width: 28,
            height: 28,
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            zIndex: 1000,
            transition: 'all 0.15s ease',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255, 255, 255, 0.8)',
          }}
          onClick={toggleMute}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            e.target.style.color = 'rgba(255, 255, 255, 1)';
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.target.style.color = 'rgba(255, 255, 255, 0.8)';
            e.target.style.background = 'transparent';
          }}
        >
          {isMuted ? '×' : '○'}
        </button>
      </div>
    </div>
  )
}

export default IntroPage
