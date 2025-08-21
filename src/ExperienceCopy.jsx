import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PhotoFrame from './PhotoFrame'
import { Html } from '@react-three/drei'
import React from 'react'
import { useControls } from 'leva'

const ExperienceCopy = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const [hasError, setHasError] = useState(false)

  // Music state and audio ref
  const [isMuted, setIsMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = React.useRef(null);

  // TV zoom state
  const [isZoomed, setIsZoomed] = useState(false);

  // Music strip hover state
  const [isMusicStripHovered, setIsMusicStripHovered] = useState(false);

  // Fixed values for B0 layer (from Leva panel)
  const b0Controls = {
    b0Scale: 0.59,
    b0X: -388,
    b0Y: -204,
    b0ParallaxX: 10.0,
    b0ParallaxY: 10.0,
    b0Opacity: 1.0,
  };

  // Fixed values for text layer (between B0 and B1) - hover text
  const textControls = {
    textX: 116, // Fixed value
    textY: 16, // Fixed value
    textScale: 0.58,
    textParallaxX: 11.0,
    textParallaxY: 11.2,
    textFontSize: 24,
    textColor: '#000000',
    textContent: 'Click to start the stroll\nthrough the memories',
    textOpacity: 1.00,
    textFontWeight: 100,
    textMaxWidth: 600,
  };

  // Final constant values for all parallax layers (from Leva panel)
  const b1Controls = {
    b1Scale: 1.6,
    b1X: 15,
    b1Y: -95,
    b1ParallaxX: 0,
    b1ParallaxY: 0,
    b1Opacity: 1.0,
  }

  // Fixed values for group scale, x, y (Leva removed)
  const groupScale = 0.33;
  const globalX = 0.69;
  const globalY = 0.32;


  // Leva controls for B2 layer
  // Final fixed values for B2 layer (Y value fixed from Leva)
  const b2Controls = {
    b2Scale: 1.15,
    b2X: -27,
    b2Y: -29, // Fixed value
    b2ParallaxX: 1,
    b2ParallaxY: 1,
    b2Opacity: 1.0,
  }

  // Final values for video background (no Leva)
  const videoConfig = {
    x: 30, // px offset
    y: -49, // px offset
    width: 14, // vw
    height: 19, // vh
    objectFit: 'cover',
  }

  const b3Controls = {
    b3Scale: 0.8,
    b3X: -160,
    b3Y: 91, // Fixed value
    b3ParallaxX: 2,
    b3ParallaxY: 2,
    b3Opacity: 1.0,
  }

  // Fixed MusicStrip Button values from Leva panel
  const musicBtnStyle = {
    width: 252,
    height: 480,
    position: 'absolute',
    left: 220,
    top: 0,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    borderRadius: 12,
    zIndex: 15,
    cursor: 'pointer',
    fontFamily: 'Helvetica Neue',
    fontWeight: 100,
    fontSize: 18,
    transition: 'color 0.2s',
    pointerEvents: 'auto',
  };

  // Fixed TV Button values (from Leva controls)
  const rectButtonControls = {
    width: 340,
    height: 250,
    x: 585,
    y: 230,
    backgroundColor: '#ff6b6b',
    borderColor: '#000000',
    borderWidth: 0,
    borderRadius: 0,
    opacity: 0.0, // Made invisible
    text: 'TV',
    textColor: '#ffffff',
    fontSize: 16,
  };

  // Fixed zoom transition values (from Leva controls)
  const zoomControls = {
    zoomScale: 5.0,
    zoomCenterX: 15,
    zoomCenterY: -425,
    transitionDuration: 2600,
    targetLayerOpacity: 0.1,
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1)
  }

  const handleImageError = (imageName) => {
    console.error(`Failed to load image: ${imageName}`)
    console.error(`Full path attempted: /parallax/${imageName}`)
    setHasError(true)
  }

  // Play music after 1000ms on mount (when navigated from InstructionPage)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (audioRef.current && !audioStarted) {
        audioRef.current.play();
        setAudioStarted(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [audioStarted]);

  // Handle mute/unmute
  const handleMuteToggle = () => {
    setIsMuted(m => {
      if (audioRef.current) audioRef.current.muted = !m;
      return !m;
    });
  };

  // Handle TV button click for zoom
  const handleTVClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsZoomed(!isZoomed);
    console.log('TV Button clicked! Zoom:', !isZoomed);
  };

  // Handle Music Strip button click - simple navigation
  const handleMusicStripClick = (e) => {
    console.log('Music Strip Button clicked!');
    e.stopPropagation();
    navigate('/musicstrip');
  };

  // Handle Music Strip hover states
  const handleMusicStripMouseEnter = () => {
    console.log('Music Strip Button hover enter');
    setIsMusicStripHovered(true);
  };

  const handleMusicStripMouseLeave = () => {
    console.log('Music Strip Button hover leave');
    setIsMusicStripHovered(false);
  };

  // Handle click outside to close zoom
  const handleContainerClick = () => {
    if (isZoomed) {
      setIsZoomed(false);
      console.log('Clicked outside - closing zoom');
    }
  };

  return (
    <div 
      className="experience-container"
      style={{
        transform: isZoomed 
          ? `translate(${-zoomControls.zoomCenterX}px, ${-zoomControls.zoomCenterY}px) scale(${zoomControls.zoomScale})`
          : 'translate(0px, 0px) scale(1)',
        transition: isZoomed 
          ? `transform ${zoomControls.transitionDuration}ms ease-in-out`
          : `transform ${zoomControls.transitionDuration}ms ease-out`,
        transformOrigin: 'center center',
        background: '#1a1a1a', // Consistent background color
      }}
      onClick={handleContainerClick}
    >
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/music/Intro music.m4a"
        loop
        autoPlay={false}
        muted={isMuted}
        style={{ display: 'none' }}
      />

      {/* Volume Icon UI (corner) */}
      <div
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 100,
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          padding: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'background 0.2s',
          opacity: 1,
          transform: 'scale(1)',
        }}
        onClick={handleMuteToggle}
        className={isMuted ? 'volume-muted' : 'volume-on'}
      >
        <span
          style={{
            display: 'inline-block',
            width: 24,
            height: 24,
            transition: 'transform 0.3s',
            color: '#fff',
            animation: audioStarted ? 'pulse 1s infinite' : 'none',
          }}
        >
          {isMuted ? (
            // Mute icon SVG (with slash)
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M16.5 12c0-1.77-.77-3.37-2-4.47l1.42-1.42A7.97 7.97 0 0 1 18.5 12c0 2.21-.9 4.21-2.36 5.62l-1.42-1.42A5.978 5.978 0 0 0 16.5 12zM12 4L9.91 6.09 12 8.18V4zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.51.38-1.07.65-1.67.82v2.18c1.14-.35 2.18-.91 3.06-1.66L19.73 21 21 19.73l-9-9L4.27 3zM16 15.17l-2.17-2.17 0.17 2.17h2zm-4-1.17l-1.09-1.09L7 12.83V9.17l.91-.91L3.27 3.73 4.27 3z"/>
            </svg>
          ) : (
            // Volume icon SVG
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-.77-3.37-2-4.47l1.42-1.42A7.97 7.97 0 0 1 18.5 12c0 2.21-.9 4.21-2.36 5.62l-1.42-1.42A5.978 5.978 0 0 0 16.5 12z"/></svg>
          )}
        </span>
      </div>

      {/* Music Strip Button */}
      <button
        className="musicstrip-btn"
        style={musicBtnStyle}
        onClick={handleMusicStripClick}
        onMouseEnter={handleMusicStripMouseEnter}
        onMouseLeave={handleMusicStripMouseLeave}
      >
        {/* No text, button is empty for UI/interaction only */}
      </button>

      {/* TV Button with Leva Controls */}
      <button
        style={{
          position: 'absolute',
          width: `${rectButtonControls.width}px`,
          height: `${rectButtonControls.height}px`,
          left: `${rectButtonControls.x}px`,
          top: `${rectButtonControls.y}px`,
          backgroundColor: rectButtonControls.backgroundColor,
          border: `${rectButtonControls.borderWidth}px solid ${rectButtonControls.borderColor}`,
          borderRadius: `${rectButtonControls.borderRadius}px`,
          opacity: rectButtonControls.opacity,
          color: rectButtonControls.textColor,
          fontSize: `${rectButtonControls.fontSize}px`,
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontWeight: '400',
          cursor: 'pointer',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto',
        }}
        onClick={handleTVClick}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {rectButtonControls.text}
      </button>

      {/* Debug Info - Removed position indicator */}


      {/* B0 Layer (behind B1) */}
      <div 
        className="parallax-layer layer-b0"
        style={{
          transform: `translate(${b0Controls.b0X + mousePos.x * b0Controls.b0ParallaxX}px, ${b0Controls.b0Y + mousePos.y * b0Controls.b0ParallaxY}px) scale(${b0Controls.b0Scale})`,
          opacity: isZoomed ? zoomControls.targetLayerOpacity : b0Controls.b0Opacity,
          zIndex: 0,
          pointerEvents: 'none',
          transition: isZoomed 
            ? `opacity ${zoomControls.transitionDuration}ms ease-in-out`
            : 'opacity 0ms',
          position: 'absolute',
        }}
      >
        <img 
          src={`/parallax/B0.png?v=${Date.now()}`}
          alt="B0 Layer" 
          onLoad={handleImageLoad}
          onError={() => handleImageError('B0.png')}
        />
      </div>

      {/* Text Layer (hover text and creative UI) */}
      <div 
        className="parallax-layer layer-text"
        style={{
          transform: `translate(${textControls.textX + mousePos.x * textControls.textParallaxX}px, ${textControls.textY + mousePos.y * textControls.textParallaxY}px) scale(${textControls.textScale})`,
          opacity: isMusicStripHovered ? textControls.textOpacity : 0,
          zIndex: 2, // In front of B1 layer
          position: 'absolute',
          color: textControls.textColor,
          fontSize: `${textControls.textFontSize}px`,
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontWeight: textControls.textFontWeight,
          textAlign: 'center',
          lineHeight: '1.4',
          maxWidth: `${textControls.textMaxWidth}px`,
          pointerEvents: 'none',
          transition: isMusicStripHovered 
            ? 'opacity 0.4s ease-in'
            : 'opacity 0.4s ease-out',
          textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
          whiteSpace: 'pre-line',
        }}
      >
        {textControls.textContent}
        
        {/* Creative UI Elements - Simple & Minimal */}
        <div 
          style={{
            marginTop: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
          }}
        >
          {/* Minimal Text Button */}
          <div 
            style={{
              padding: '8px 16px',
              color: '#333',
              fontSize: '14px',
              fontWeight: '300',
              border: '1px solid #333',
              borderRadius: '2px',
              opacity: isMusicStripHovered ? 1 : 0,
              transform: isMusicStripHovered ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 0.4s ease',
              background: 'transparent',
            }}
          >
            START
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        button, .musicstrip-btn {
          cursor: pointer !important;
        }
      `}</style>

      {/* Background Layer (B1.png) */}
      <div 
        className="parallax-layer layer-back"
        style={{
          transform: `translate(${b1Controls.b1X + mousePos.x * b1Controls.b1ParallaxX}px, ${b1Controls.b1Y + mousePos.y * b1Controls.b1ParallaxY}px) scale(${b1Controls.b1Scale})`,
          opacity: isZoomed ? zoomControls.targetLayerOpacity : b1Controls.b1Opacity,
          zIndex: 1,
          pointerEvents: 'none',
          transition: isZoomed 
            ? `opacity ${zoomControls.transitionDuration}ms ease-in-out`
            : 'opacity 0ms',
          position: 'absolute',
        }}
      >
        <img 
          src="/parallax/B1.png" 
          alt="Background Layer" 
          onLoad={handleImageLoad}
          onError={() => handleImageError('B1.png')}
        />
      </div>


      {/* Middle Layer (B2.png) */}
      <div 
        className="parallax-layer layer-middle"
        style={{
          transform: `translate(${b2Controls.b2X + mousePos.x * b2Controls.b2ParallaxX}px, ${b2Controls.b2Y + mousePos.y * b2Controls.b2ParallaxY}px) scale(${b2Controls.b2Scale})`,
          opacity: b2Controls.b2Opacity,
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {/* Video background behind B2 image */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="background-video b2-video"
            style={{
              position: 'absolute',
              top: `calc(50% + ${videoConfig.y}px)`,
              left: `calc(50% + ${videoConfig.x}px)`,
              width: `${videoConfig.width}vw`,
              height: `${videoConfig.height}vh`,
              transform: 'translate(-50%, -50%)',
              objectFit: videoConfig.objectFit,
              zIndex: 0,
              pointerEvents: 'auto', // allow video to play
            }}
            onLoadedData={e => { e.target.play(); console.debug('Video loaded:', '/video/tvintro.webm, /video/tvintro.mp4') }}
          >
            <source src="/video/tvintro.webm" type="video/webm" />
            <source src="/video/tvintro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {/* B2 image above video */}
        <img 
          src="/parallax/B2.png" 
          alt="Middle Layer" 
          onLoad={handleImageLoad}
          onError={() => handleImageError('B2.png')}
          style={{ position: 'relative', zIndex: 1 }}
        />
      </div>


      {/* Front Layer (B3.png - closest) */}
      <div 
        className="parallax-layer layer-front"
        style={{
          transform: `translate(${b3Controls.b3X + mousePos.x * b3Controls.b3ParallaxX}px, ${b3Controls.b3Y + mousePos.y * b3Controls.b3ParallaxY}px) scale(${b3Controls.b3Scale})`,
          opacity: isZoomed ? zoomControls.targetLayerOpacity : b3Controls.b3Opacity,
          zIndex: 1,
          pointerEvents: 'none',
          transition: isZoomed 
            ? `opacity ${zoomControls.transitionDuration}ms ease-in-out`
            : 'opacity 0ms',
          position: 'absolute',
        }}
      >
        <img 
          src="/parallax/B3.png" 
          alt="Front Layer" 
          onLoad={handleImageLoad}
          onError={() => handleImageError('B3.png')}
        />
      </div>



      {/* Photo Frames */}
      <div>
        <PhotoFrame globalX={globalX} globalY={globalY} groupScale={groupScale} />
      </div>

      {/* Content overlay for future frame positioning */}
      <div className="content-overlay" style={{ pointerEvents: 'none' }}>
        {/* Photo frames will be positioned here */}
      </div>
    </div>
  )
}

export default ExperienceCopy
