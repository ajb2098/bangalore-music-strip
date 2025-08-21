import React, { useEffect } from 'react'
import { useGlobalAudio } from './GlobalAudioContext.jsx'

const LOADER_STYLE = {
  btnText: 'Next',
  btnWidth: 150,
  btnHeight: 58,
  btnX: 5,
  btnY: 60,
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

const QuotationPage = ({ onFinish }) => {
  const { updateVolumeForPage, toggleMute, isMuted } = useGlobalAudio();

  // Update volume for this page
  useEffect(() => {
    updateVolumeForPage('intro3');
  }, [updateVolumeForPage]);

  // Handle button click
  const handleStart = () => {
    if (onFinish) onFinish()
  }

  return (
    <div className="introloader-root">
      <div className="introloader-overlay" />
      <div className="introloader-content">
        <div
          className="introloader-subtitle"
          style={{
            transform: `translate(${LOADER_STYLE.subtitleX}px, ${LOADER_STYLE.subtitleY}px) scale(${LOADER_STYLE.subtitleScale})`,
            color: LOADER_STYLE.subtitleColor,
            transition: 'all 0.2s',
            lineHeight: 1.6,
            maxWidth: '80%',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          Welcome to an unfolding journey through the forgotten rhythms of Bangalore's musical past. This interactive anthology blends illustration, sound design, and archival storytelling to trace the soul of a city once alive with street music, rebellion, and resilience.
          <br /><br />
          Wander through sketched streets and sonic fragments — radios whispering resistance during the Emergency, 90s TV shop windows echoing the angst of indie bands, and busking corners where folk met funk.
          <br /><br />
          Click, listen, zoom in — each part of the cityscape holds a story waiting to be heard.
        </div>
        <button
          className="introloader-btn"
          onClick={handleStart}
          style={{
            width: LOADER_STYLE.btnWidth,
            height: LOADER_STYLE.btnHeight,
            transform: `translate(${LOADER_STYLE.btnX}px, ${LOADER_STYLE.btnY}px) scale(${LOADER_STYLE.btnScale})`,
            opacity: LOADER_STYLE.btnOpacity,
            transition: 'all 0.2s',
          }}
        >
          <span className="introloader-btn-text" style={{ color: LOADER_STYLE.btnTextColor }}>{LOADER_STYLE.btnText}</span>
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

export default QuotationPage
