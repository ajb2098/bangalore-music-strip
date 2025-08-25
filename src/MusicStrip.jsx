// MusicStrip.jsx
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, RandomizedLight } from '@react-three/drei';
import { getProject, val } from '@theatre/core';
import { SheetProvider, PerspectiveCamera, useCurrentSheet } from '@theatre/r3f';
import { useGlobalAudio } from './GlobalAudioContext.jsx';

import MusicStripModel from './MusicStripModel';
import musicStripState from './Music Strip Animation.theatre-project-state.json';
import Lightbox from './Lightbox';
import TextOverlay from './TextOverlay';

const musicStripProject = getProject('Music Strip Animation', {
  state: musicStripState,
});
const animationSheet = musicStripProject.sheet('Camera Flythrough');

function Scene({ onVideoTrigger, textRef, onScrollPositionChange }) {
  const sheet = useCurrentSheet();
  const scroll = useScroll();
  const modelRef = useRef();
  const lastPositionRef = useRef(0);

  useFrame(() => {
    const sequenceLength = val(sheet.sequence.pointer.length);
    const targetPosition = scroll.offset * sequenceLength;
    
    // Smooth interpolation to reduce jumpiness - very slow transitions
    const smoothFactor = 0.02; // Further reduced from 0.05 for very slow transitions
    const smoothPosition = lastPositionRef.current + (targetPosition - lastPositionRef.current) * smoothFactor;
    lastPositionRef.current = smoothPosition;
    
    sheet.sequence.position = smoothPosition;

    // Pass scroll position to parent for metro sound control
    if (onScrollPositionChange) {
      onScrollPositionChange(smoothPosition);
    }

    if (modelRef.current) {
      modelRef.current.setVisibility("S2", !(smoothPosition >= 0 && smoothPosition < 2));
      modelRef.current.setVisibility("S1", smoothPosition < 2);

      // Control visibility for all P1-P8 meshes based on scroll position
      modelRef.current.setVisibility("P1", smoothPosition >= 0 && smoothPosition < 2);
      modelRef.current.setVisibility("P2", smoothPosition >= 2 && smoothPosition < 4);
      modelRef.current.setVisibility("P3", smoothPosition >= 6 && smoothPosition < 8);
      modelRef.current.setVisibility("P4", smoothPosition >= 8 && smoothPosition < 10);
      modelRef.current.setVisibility("P5", true); // Always visible for debugging
      modelRef.current.setVisibility("P6", smoothPosition >= 13 && smoothPosition < 15);
      modelRef.current.setVisibility("P7", smoothPosition >= 14 && smoothPosition < 16.5);
      modelRef.current.setVisibility("P8", smoothPosition >= 16 && smoothPosition < 18);
    }

    // Debug message
    if (smoothPosition === 0) {
      console.log('🎬 At start position - P1 and P5 should be visible and clickable');
    }

    if (textRef.current) {
      textRef.current.setTextVisibility(0, smoothPosition >= 0 && smoothPosition < 0.8); // Restored visibility
      textRef.current.setTextVisibility(1, smoothPosition >= 3.2 && smoothPosition < 4.5);
      textRef.current.setTextVisibility(2, smoothPosition >= 6.34 && smoothPosition < 8.6);
      textRef.current.setTextVisibility(3, smoothPosition >= 8.75 && smoothPosition < 9.23);
      textRef.current.setTextVisibility(4, smoothPosition >= 11.49 && smoothPosition < 12.53);
      textRef.current.setTextVisibility(5, smoothPosition >= 13 && smoothPosition < 13.9);
      textRef.current.setTextVisibility(6, smoothPosition >= 15.5 && smoothPosition < 16.7);
      textRef.current.setTextVisibility(7, smoothPosition >= 16.6 && smoothPosition < 17.5);
      textRef.current.setTextVisibility(8, smoothPosition >= 18.44 && smoothPosition < 18.88);
    }
  });

  return (
    <>
      <color attach="background" args={['#f0f0f0']} />
      <ambientLight intensity={2} />
      <directionalLight position={[5, 10, 5]} intensity={1.0} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <RandomizedLight castShadow amount={10} frames={100} position={[0, 3, 0]} />

      <Suspense fallback={null}>
        <MusicStripModel ref={modelRef} onVideoTrigger={onVideoTrigger} />
      </Suspense>

      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[5, 3, 5]}
        fov={45}
        near={0.01}
        far={10}
      />
    </>
  );
}

const MusicStrip = () => {
  // Get global audio context - stop intro music on this page
  const { updateVolumeForPage } = useGlobalAudio();
  
  // Stop intro music when entering music strip
  useEffect(() => {
    updateVolumeForPage('musicstrip'); // This will pause intro music
  }, [updateVolumeForPage]);

  const [videoIndex, setVideoIndex] = useState(null);
  const textRef = useRef();
  const audioRef = useRef(); // This handles bg.m4a background music

  // Debug videoIndex changes
  useEffect(() => {
    console.log(`🎬 MusicStrip videoIndex changed to:`, videoIndex);
  }, [videoIndex]);
  
  // Audio refs for all ambient sounds
  const firstAudioRef = useRef();
  const secondAudioRef = useRef();
  const hippieAudioRef = useRef();
  const cubbonAudioRef = useRef();
  const streetAudioRef = useRef();
  const metroAudioRef = useRef();
  const churchStreetAudioRef = useRef();
  
  const fadeIntervalRef = useRef(null);
  const soundFadeIntervals = useRef({}); // Store fade intervals for each sound
  
  const [currentPosition, setCurrentPosition] = useState(0);
  const [activeSounds, setActiveSounds] = useState(new Set()); // Track which sounds are playing

  // Enhanced video trigger function with debugging
  const handleVideoTrigger = (index) => {
    console.log(`🎬 Video trigger called with index: ${index}`);
    console.log(`🎬 Current videoIndex state before update: ${videoIndex}`);
    setVideoIndex(index);
    console.log(`🎬 SetVideoIndex called with: ${index}`);
  };

  // Function to fade any audio in or out
  const fadeAudio = (audio, targetVolume, duration = 1500) => {
    if (!audio) return;
    
    // Clear any existing fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    
    const startVolume = audio.volume;
    const volumeStep = (targetVolume - startVolume) / (duration / 50);
    let currentVolume = startVolume;
    
    fadeIntervalRef.current = setInterval(() => {
      currentVolume += volumeStep;
      
      // Check if we've reached the target
      if ((volumeStep > 0 && currentVolume >= targetVolume) || 
          (volumeStep < 0 && currentVolume <= targetVolume)) {
        currentVolume = targetVolume;
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      
      audio.volume = Math.max(0, Math.min(1, currentVolume));
    }, 50);
  };

  // Function to fade specific sound audio in or out
  const fadeSoundAudio = (audioRef, soundName, targetVolume, duration = 800) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Clear any existing fade for this sound
    if (soundFadeIntervals.current[soundName]) {
      clearInterval(soundFadeIntervals.current[soundName]);
    }
    
    const startVolume = audio.volume;
    const volumeStep = (targetVolume - startVolume) / (duration / 50);
    let currentVolume = startVolume;
    
    soundFadeIntervals.current[soundName] = setInterval(() => {
      currentVolume += volumeStep;
      
      // Check if we've reached the target
      if ((volumeStep > 0 && currentVolume >= targetVolume) || 
          (volumeStep < 0 && currentVolume <= targetVolume)) {
        currentVolume = targetVolume;
        clearInterval(soundFadeIntervals.current[soundName]);
        soundFadeIntervals.current[soundName] = null;
        
        // If fading out to 0, pause the audio
        if (targetVolume === 0) {
          audio.pause();
        }
      }
      
      audio.volume = Math.max(0, Math.min(1, currentVolume));
    }, 50);
  };

  // Handle scroll position changes for all background sounds
  const handleScrollPositionChange = (position) => {
    // Update position for display
    setCurrentPosition(position);
    
    // Adjust background music volume based on position
    const bgAudio = audioRef.current;
    if (bgAudio) {
      const targetBgVolume = position >= 2 ? 0.15 : 0.25; // Decreased from 0.20/0.30
      if (Math.abs(bgAudio.volume - targetBgVolume) > 0.02) {
        fadeAudio(bgAudio, targetBgVolume, 1000); // Smooth transition over 1 second
      }
    }
    
    // Define sound ranges with maximum volumes for better audibility
    const soundRanges = [
      { name: 'first', ref: firstAudioRef, start: 2.3, end: 6, volume: 0.95 }, // Increased from 0.8
      { name: '2nd', ref: secondAudioRef, start: 6, end: 8.72, volume: 0.95 }, // Increased from 0.8
      { name: 'hippie', ref: hippieAudioRef, start: 8.72, end: 10, volume: 0.95 }, // Increased from 0.8
      { name: 'cubbon', ref: cubbonAudioRef, start: 10, end: 15, volume: 0.95 }, // Increased from 0.8
      { name: 'street', ref: streetAudioRef, start: 15, end: 17.5, volume: 0.95 }, // Increased from 0.8
      { name: 'metro', ref: metroAudioRef, start: 17.5, end: 18.10, volume: 0.95 }, // Increased from 0.9
      { name: 'churchStreet', ref: churchStreetAudioRef, start: 18.10, end: 19.8, volume: 0.95 }, // Increased from 0.8
    ];

    // Check each sound range
    soundRanges.forEach(({ name, ref, start, end, volume }) => {
      const audio = ref.current;
      if (!audio) return;

      const shouldPlay = position >= start && position < end;
      const isPlaying = activeSounds.has(name);

      if (shouldPlay && !isPlaying) {
        console.log(`Starting ${name} sound - fade in`);
        setActiveSounds(prev => new Set([...prev, name]));
        audio.currentTime = 0; // Reset to beginning
        audio.volume = 0; // Start at 0 volume
        audio.play().then(() => {
          fadeSoundAudio(ref, name, volume, 600); // Fade in over 600ms
        }).catch(console.error);
      } else if (!shouldPlay && isPlaying) {
        console.log(`Stopping ${name} sound - fade out`);
        setActiveSounds(prev => {
          const newSet = new Set(prev);
          newSet.delete(name);
          return newSet;
        });
        fadeSoundAudio(ref, name, 0, 400); // Fade out over 400ms
      }
    });
  };

  // Background music effect (bg.m4a plays only in MusicStrip)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Set audio properties
      audio.loop = true;
      audio.volume = 0; // Start with volume at 0 for fade-in effect
      
      // Add event listeners for debugging
      audio.addEventListener('loadstart', () => console.log('🎵 bg.m4a: Load started'));
      audio.addEventListener('loadeddata', () => console.log('🎵 bg.m4a: Data loaded'));
      audio.addEventListener('canplay', () => console.log('🎵 bg.m4a: Can start playing'));
      audio.addEventListener('play', () => console.log('🎵 bg.m4a: Started playing'));
      audio.addEventListener('pause', () => console.log('🎵 bg.m4a: Paused'));
      audio.addEventListener('error', (e) => console.error('🎵 bg.m4a Error:', e));
      
      // Try to play audio after 500ms delay with fade-in
      const playAudio = async () => {
        setTimeout(async () => {
          try {
            console.log('🎵 Attempting to start bg.m4a background music...');
            await audio.play();
            console.log('🎵 bg.m4a background music started successfully with fade-in');
            // Start fade-in effect over 2 seconds with decreased volume
            fadeAudio(audio, 0.25, 2000); // Decreased from 0.35 to 0.25
          } catch (error) {
            console.log('🎵 bg.m4a autoplay blocked. User interaction required:', error);
          }
        }, 500); // 500ms delay
      };

      playAudio();

      // Cleanup function to pause audio when component unmounts
      return () => {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
        // Clear all sound fade intervals
        Object.values(soundFadeIntervals.current).forEach(interval => {
          if (interval) clearInterval(interval);
        });
        
        // Clean up main background music
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 0;
        }
        
        // Clean up all background sounds
        [firstAudioRef, secondAudioRef, hippieAudioRef, cubbonAudioRef, 
         streetAudioRef, metroAudioRef, churchStreetAudioRef].forEach(ref => {
          if (ref.current) {
            ref.current.pause();
            ref.current.currentTime = 0;
            ref.current.volume = 0;
          }
        });
      };
    }
  }, []);

  // Handle user interaction to start audio if autoplay was blocked
  const handleUserInteraction = () => {
    console.log('🎵 User interaction detected - attempting to start audio...');
    const audio = audioRef.current;
    if (audio && audio.paused) {
      console.log('🎵 Background music is paused, starting...');
      // Start with volume 0 and fade in
      audio.volume = 0;
      audio.play().then(() => {
        console.log('🎵 Background music started via user interaction with fade-in');
        // Fade in over 2 seconds with decreased volume
        const fadeInAudio = (audio, targetVolume = 0.15, duration = 2000) => { // Decreased from 0.20 to 0.15
          const startVolume = 0;
          const volumeStep = targetVolume / (duration / 50);
          let currentVolume = startVolume;
          
          const fadeInterval = setInterval(() => {
            currentVolume += volumeStep;
            if (currentVolume >= targetVolume) {
              currentVolume = targetVolume;
              clearInterval(fadeInterval);
            }
            audio.volume = currentVolume;
          }, 50);
        };
        fadeInAudio(audio, 0.15, 2000); // Decreased from 0.20 to 0.15
      }).catch((error) => {
        console.error('🎵 Failed to start background music:', error);
      });
    } else if (audio && !audio.paused) {
      console.log('🎵 Background music is already playing');
    } else if (!audio) {
      console.error('🎵 Background music audio element not found');
    }
    
    // Also try to start any ambient sounds that should be playing based on current position
    const soundRefs = [
      { name: 'first', ref: firstAudioRef, start: 2.3, end: 6 },
      { name: '2nd', ref: secondAudioRef, start: 6, end: 8.72 },
      { name: 'hippie', ref: hippieAudioRef, start: 8.72, end: 10 },
      { name: 'cubbon', ref: cubbonAudioRef, start: 10, end: 15 },
      { name: 'street', ref: streetAudioRef, start: 15, end: 17.5 },
      { name: 'metro', ref: metroAudioRef, start: 17.5, end: 18.10 },
      { name: 'churchStreet', ref: churchStreetAudioRef, start: 18.10, end: 19.8 },
    ];
    
    soundRefs.forEach(({ name, ref, start, end }) => {
      const soundAudio = ref.current;
      if (soundAudio && soundAudio.paused && currentPosition >= start && currentPosition < end && !activeSounds.has(name)) {
        console.log(`User interaction: Starting ${name} sound`);
        soundAudio.play().catch(console.error);
      }
    });
  };

  // Watch for videoIndex changes to handle fade-out when lightbox opens
  useEffect(() => {
    if (videoIndex !== null) {
      console.log('🎬 Lightbox opened - fading out background music');
      handleLightboxOpen();
    }
  }, [videoIndex]);

  // Handle video playing (fade out all audio for better video experience)
  const handleVideoPlay = () => {
    console.log('🎬 Video playing - completely muting all background audio');
    
    // Completely mute background music immediately
    const bgAudio = audioRef.current;
    if (bgAudio && !bgAudio.paused) {
      console.log('🔇 Muting background music for video playback');
      fadeAudio(bgAudio, 0, 300); // Very quick fade to complete silence
    }
    
    // Fade out all active ambient sounds
    const ambientRefs = [
      { name: 'first', ref: firstAudioRef },
      { name: '2nd', ref: secondAudioRef },
      { name: 'hippie', ref: hippieAudioRef },
      { name: 'cubbon', ref: cubbonAudioRef },
      { name: 'street', ref: streetAudioRef },
      { name: 'metro', ref: metroAudioRef },
      { name: 'churchStreet', ref: churchStreetAudioRef },
    ];
    
    ambientRefs.forEach(({ name, ref }) => {
      if (activeSounds.has(name)) {
        console.log(`🔇 Muting ${name} sound for video playback`);
        fadeSoundAudio(ref, name, 0, 300); // Quick fade out
      }
    });
  };

  // Handle video pausing/ending (restore background audio)
  const handleVideoPause = () => {
    console.log('🎬 Video paused/ended - restoring background audio');
    
    // Restore background music
    const bgAudio = audioRef.current;
    if (bgAudio && !bgAudio.paused) {
      const targetVolume = currentPosition >= 2 ? 0.15 : 0.25;
      fadeAudio(bgAudio, targetVolume, 800); // Gentle fade in
    }
    
    // Restore ambient sounds based on current position
    const soundRanges = [
      { name: 'first', ref: firstAudioRef, start: 2.3, end: 6, volume: 0.95 },
      { name: '2nd', ref: secondAudioRef, start: 6, end: 8.72, volume: 0.95 },
      { name: 'hippie', ref: hippieAudioRef, start: 8.72, end: 10, volume: 0.95 },
      { name: 'cubbon', ref: cubbonAudioRef, start: 10, end: 15, volume: 0.95 },
      { name: 'street', ref: streetAudioRef, start: 15, end: 17.5, volume: 0.95 },
      { name: 'metro', ref: metroAudioRef, start: 17.5, end: 18.10, volume: 0.95 },
      { name: 'churchStreet', ref: churchStreetAudioRef, start: 18.10, end: 19.8, volume: 0.95 },
    ];
    
    soundRanges.forEach(({ name, ref, start, end, volume }) => {
      if (currentPosition >= start && currentPosition < end && activeSounds.has(name)) {
        fadeSoundAudio(ref, name, volume, 600); // Gentle fade in
      }
    });
  };

  // Handle lightbox opening (decrease background music and ambient sounds volume)
  const handleLightboxOpen = () => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      console.log('🔇 Lightbox opened - fading out background music from', audio.volume, 'to 0.02');
      fadeAudio(audio, 0.02, 500); // Much lower volume and faster fade
    } else if (audio && audio.paused) {
      console.log('🔇 Background music is paused, cannot fade');
    } else {
      console.log('🔇 No background audio found');
    }
    
    // Also fade out all active ambient sounds
    const ambientRefs = [
      { name: 'first', ref: firstAudioRef },
      { name: '2nd', ref: secondAudioRef },
      { name: 'hippie', ref: hippieAudioRef },
      { name: 'cubbon', ref: cubbonAudioRef },
      { name: 'street', ref: streetAudioRef },
      { name: 'metro', ref: metroAudioRef },
      { name: 'churchStreet', ref: churchStreetAudioRef },
    ];
    
    ambientRefs.forEach(({ name, ref }) => {
      if (activeSounds.has(name)) {
        console.log(`🔇 Lightbox opened - fading out ${name} ambient sound`);
        fadeSoundAudio(ref, name, 0.02, 500); // Fade to very low volume instead of muting completely
      }
    });
  };

  // Handle lightbox closing (restore background music and ambient sounds volume)
  const handleLightboxClose = () => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      const targetVolume = currentPosition >= 2 ? 0.15 : 0.25; // Restore to appropriate volume based on position
      console.log('🔊 Lightbox closed - restoring background music volume to', targetVolume);
      fadeAudio(audio, targetVolume, 1000); // Fade back to normal volume
    }
    
    // Restore ambient sounds based on current position
    const soundRanges = [
      { name: 'first', ref: firstAudioRef, start: 2.3, end: 6, volume: 0.95 },
      { name: '2nd', ref: secondAudioRef, start: 6, end: 8.72, volume: 0.95 },
      { name: 'hippie', ref: hippieAudioRef, start: 8.72, end: 10, volume: 0.95 },
      { name: 'cubbon', ref: cubbonAudioRef, start: 10, end: 15, volume: 0.95 },
      { name: 'street', ref: streetAudioRef, start: 15, end: 17.5, volume: 0.95 },
      { name: 'metro', ref: metroAudioRef, start: 17.5, end: 18.10, volume: 0.95 },
      { name: 'churchStreet', ref: churchStreetAudioRef, start: 18.10, end: 19.8, volume: 0.95 },
    ];
    
    soundRanges.forEach(({ name, ref, start, end, volume }) => {
      if (currentPosition >= start && currentPosition < end && activeSounds.has(name)) {
        console.log(`🔊 Lightbox closed - restoring ${name} ambient sound to volume`, volume);
        fadeSoundAudio(ref, name, volume, 1000); // Gentle fade back to normal volume
      }
    });
    
    setVideoIndex(null);
  };

  return (
    <>
      {/* Background Music */}
      <audio 
        ref={audioRef}
        src="/music/bg.m4a"
        preload="auto"
        style={{ display: 'none' }}
      />
      
      {/* Background Sounds */}
      <audio ref={firstAudioRef} src="/sounds/first.mp3" loop preload="auto" style={{ display: 'none' }} />
      <audio ref={secondAudioRef} src="/sounds/2nd.mp3" loop preload="auto" style={{ display: 'none' }} />
      <audio ref={hippieAudioRef} src="/sounds/Hippie.mp3" loop preload="auto" style={{ display: 'none' }} />
      <audio ref={cubbonAudioRef} src="/sounds/cubbon.mp3" loop preload="auto" style={{ display: 'none' }} />
      <audio ref={streetAudioRef} src="/sounds/street.mp3" loop preload="auto" style={{ display: 'none' }} />
      <audio ref={metroAudioRef} src="/sounds/metro.mp3" loop preload="auto" style={{ display: 'none' }} />
      <audio ref={churchStreetAudioRef} src="/sounds/church street.mp3" loop preload="auto" style={{ display: 'none' }} />
      
      <Canvas shadows onClick={handleUserInteraction}>
        <ScrollControls pages={5} damping={0.15}>
          <SheetProvider sheet={animationSheet}>
            <Scene 
              onVideoTrigger={handleVideoTrigger} 
              textRef={textRef} 
              onScrollPositionChange={handleScrollPositionChange}
            />
          </SheetProvider>
        </ScrollControls>
      </Canvas>

      <Lightbox 
        videoIndex={videoIndex} 
        onClose={handleLightboxClose}
        onVideoPlay={handleVideoPlay}
        onVideoPause={handleVideoPause}
      />
      <TextOverlay ref={textRef} />
    </>
  );
};

export default MusicStrip;
