"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Euler, NoToneMapping, Quaternion, Vector3 } from "three";
import {
  EffectComposer,
  Vignette,
  Noise,
  ChromaticAberration,
  Depth,
  DepthOfField,
} from "@react-three/postprocessing";
import { BlendFunction, DepthOfFieldEffect } from "postprocessing";
import { useRef } from "react";

import Boat from "./Boat";
import Birds from "./Birds/Birds";
import { Nav } from "./Navigation";
import { usePathname } from "next/navigation";

// Camera movement constants
const CAMERA_BASE_POSITION = [-3, 0.75, 20] as const;
const CAMERA_BASE_ROTATION = [0.1, 0, 0] as const; // Base rotation for the camera
const CAMERA_CV_POSITION = [-4, 0.6, 2] as const; // Adjusted for CV position
const CAMERA_SENSITIVITY = 0.2;
const CAMERA_LERP_FACTOR = 0.05;
const CAMERA_Z_MULTIPLIER = 10;

/**
 * Camera controller that follows mouse movement with smooth interpolation
 */
const DollyCamera = () => {
  const pathname = usePathname();

  // Check if we are on the CV page
  const isCVPage = pathname === "/cv";

  const quaternion = new Quaternion();

  useFrame(({ camera, pointer }) => {
    const offsetX = pointer.x * CAMERA_SENSITIVITY;
    const offsetY = pointer.y * CAMERA_SENSITIVITY;

    // If on CV page, adjust camera position

    // Calculate target position
    const targetPosition = new Vector3(
      CAMERA_BASE_POSITION[0] + offsetX,
      CAMERA_BASE_POSITION[1] + offsetY,
      CAMERA_BASE_POSITION[2] + offsetY * CAMERA_Z_MULTIPLIER
    );
    if (isCVPage) {
      targetPosition.set(
        CAMERA_CV_POSITION[0] + offsetX,
        CAMERA_CV_POSITION[1] + offsetY,
        CAMERA_CV_POSITION[2]
      );
    }

    // Smooth interpolation to target position
    camera.position.lerp(targetPosition, CAMERA_LERP_FACTOR);

    quaternion.setFromEuler(camera.rotation);

    const targetRotation: Euler = isCVPage
      ? new Euler(0.15, 0, 0) // Adjusted rotation for CV page
      : new Euler(...CAMERA_BASE_ROTATION);

    const targetQuaternion = new Quaternion().setFromEuler(targetRotation);

    // Smoothly interpolate camera rotation
    quaternion.slerp(targetQuaternion, CAMERA_LERP_FACTOR);

    camera.quaternion.copy(quaternion);
  });

  return (
    <PerspectiveCamera
      position={CAMERA_BASE_POSITION}
      rotation={[0.1, 0, 0]}
      fov={20}
      makeDefault
    />
  );
};

/**
 * Post-processing effects component
 */
const Effects = () => {
  const pathname = usePathname();

  // Check if we are on the CV page
  const isCVPage = pathname === "/cv";

  const depthRef = useRef<DepthOfFieldEffect>(null);

  const blurLevel = isCVPage ? 20 : 0; // Adjust blur level based on page

  useFrame(() => {
    if (depthRef.current) {
      // Lerp the blur level for smooth transitions
      depthRef.current.bokehScale =
        depthRef.current.bokehScale * 0.95 + blurLevel * 0.05;
    }
  });

  return (
    <EffectComposer>
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0008, 0.0008]}
      />
      <Vignette eskil={false} offset={0.2} darkness={0.6} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.7} />
      <DepthOfField ref={depthRef} focusDistance={100000}></DepthOfField>
    </EffectComposer>
  );
};

/**
 * Main scene objects
 */
const Scene = ({
  targetPosition,
}: {
  targetPosition: React.RefObject<Vector3 | null>;
}) => {
  return (
    <group rotation={[0, Math.PI / -2, 0]}>
      <Boat />
      <Birds targetPosition={targetPosition} />
    </group>
  );
};

/**
 * Main Three.js background component with 3D scene, navigation, and post-processing effects
 */
export default function ThreeBackground() {
  const targetPosition = useRef<Vector3>(null);

  const handleCanvasCreated = ({ gl }: { gl: any }) => {
    /*    gl.toneMapping = NoToneMapping; */
  };

  return (
    <div className="fixed inset-0 pointer-events-auto">
      <Canvas
        className="pointer-events-auto"
        gl={{
          antialias: true,
          alpha: true,

          preserveDrawingBuffer: true,
        }}
        onCreated={handleCanvasCreated}
      >
        <Nav targetPosition={targetPosition} />
        <Effects />
        <DollyCamera />
        <Scene targetPosition={targetPosition} />
      </Canvas>
    </div>
  );
}
