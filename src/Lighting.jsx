import React from 'react';
// import { useControls } from 'leva';

export function ThreePointLighting() {
  // Fixed lighting values from your image
  const lightingConfig = {
    // Key Light
    keyLightIntensity: 10,
    keyLightColor: '#ffffff',
    keyLightX: -0.5,
    keyLightY: 11.0,
    keyLightZ: -7.0,
    
    // Fill Light
    fillLightIntensity: 20,
    fillLightColor: '#e6f3ff',
    fillLightX: -9.5,
    fillLightY: -1.5,
    fillLightZ: 15.0,
    
    // Rim Light
    rimLightIntensity: 10,
    rimLightColor: '#ffffff',
    rimLightX: 15.0,
    rimLightY: 3.5,
    rimLightZ: 9.5,
    
    // Ambient light
    ambientIntensity: 10,
    ambientColor: '#ffffff',
    
    // Light helpers
    showLightHelpers: false
  };

  /* COMMENTED OUT - Leva controls for three-point lighting
  const {
    keyLightIntensity,
    keyLightColor,
    keyLightX,
    keyLightY,
    keyLightZ,
    fillLightIntensity,
    fillLightColor,
    fillLightX,
    fillLightY,
    fillLightZ,
    rimLightIntensity,
    rimLightColor,
    rimLightX,
    rimLightY,
    rimLightZ,
    ambientIntensity,
    ambientColor,
    showLightHelpers
  } = useControls('🎨 Lighting System', {
    keyLightIntensity: { value: 1.2, min: 0, max: 5, step: 0.1 },
    keyLightColor: '#ffffff',
    keyLightX: { value: 5, min: -15, max: 15, step: 0.5 },
    keyLightY: { value: 8, min: -15, max: 15, step: 0.5 },
    keyLightZ: { value: 3, min: -15, max: 15, step: 0.5 },
    fillLightIntensity: { value: 0.6, min: 0, max: 3, step: 0.1 },
    fillLightColor: '#e6f3ff',
    fillLightX: { value: -3, min: -15, max: 15, step: 0.5 },
    fillLightY: { value: 4, min: -15, max: 15, step: 0.5 },
    fillLightZ: { value: 6, min: -15, max: 15, step: 0.5 },
    rimLightIntensity: { value: 0.8, min: 0, max: 4, step: 0.1 },
    rimLightColor: '#ffe6cc',
    rimLightX: { value: -2, min: -15, max: 15, step: 0.5 },
    rimLightY: { value: 2, min: -15, max: 15, step: 0.5 },
    rimLightZ: { value: -8, min: -15, max: 15, step: 0.5 },
    ambientIntensity: { value: 0.3, min: 0, max: 1, step: 0.05 },
    ambientColor: '#404040',
    showLightHelpers: false
  });
  */

  // Use fixed values
  const {
    keyLightIntensity,
    keyLightColor,
    keyLightX,
    keyLightY,
    keyLightZ,
    fillLightIntensity,
    fillLightColor,
    fillLightX,
    fillLightY,
    fillLightZ,
    rimLightIntensity,
    rimLightColor,
    rimLightX,
    rimLightY,
    rimLightZ,
    ambientIntensity,
    ambientColor,
    showLightHelpers
  } = lightingConfig;

  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      
      {/* Key Light - Main directional light */}
      <directionalLight
        position={[keyLightX, keyLightY, keyLightZ]}
        intensity={keyLightIntensity}
        color={keyLightColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Fill Light - Softer light to fill shadows */}
      <directionalLight
        position={[fillLightX, fillLightY, fillLightZ]}
        intensity={fillLightIntensity}
        color={fillLightColor}
      />
      
      {/* Rim Light - Back light for edge definition */}
      <directionalLight
        position={[rimLightX, rimLightY, rimLightZ]}
        intensity={rimLightIntensity}
        color={rimLightColor}
      />
      
      {/* Light helpers - small spheres to show light positions */}
      {showLightHelpers && (
        <>
          <mesh position={[keyLightX, keyLightY, keyLightZ]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color={keyLightColor} />
          </mesh>
          <mesh position={[fillLightX, fillLightY, fillLightZ]}>
            <sphereGeometry args={[0.08]} />
            <meshBasicMaterial color={fillLightColor} />
          </mesh>
          <mesh position={[rimLightX, rimLightY, rimLightZ]}>
            <sphereGeometry args={[0.08]} />
            <meshBasicMaterial color={rimLightColor} />
          </mesh>
        </>
      )}
    </>
  );
}