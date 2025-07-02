"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

import Boat from "./Boat";
import {
  CameraControls,
  Html,
  PerspectiveCamera,
  Resize,
  Text,
  TextProps,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import {
  Fog,
  FogExp2,
  Mesh,
  NoToneMapping,
  ShaderMaterial,
  Vector3,
} from "three";
import {
  EffectComposer,
  Vignette,
  Noise,
  DepthOfField,
  GodRays,
  Bloom,
  DotScreen,
  LensFlare,
  ChromaticAberration,
} from "@react-three/postprocessing";
import {
  BlendFunction,
  KawaseBlurPass,
  KernelSize,
  Resizer,
  Resolution,
} from "postprocessing";
import Birds from "./Birds/Birds";

import textShader from "./text.vert";
import { RefObject, useRef, useState } from "react";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

// Main scene component
function Scene() {
  return (
    <>
      <PerspectiveCamera
        position={[-3, 0.75, 20]}
        rotation={[0.1, 0, 0]}
        fov={20}
        makeDefault
      />
      {/*    <CameraControls /> */}
    </>
  );
}

type NavLinkProps = Omit<TextProps, "children"> & {
  text: string;
  color: string; // Color in the format "0.1, 0.2, 0.3" (RGB)

  targetPosition: RefObject<Vector3 | null>; // Not used in this example, but can be used for navigation
};

const NavLink = ({
  color,
  text,
  position,
  targetPosition,
  ...rest
}: NavLinkProps) => {
  const uniforms = useRef({
    time: { value: 1.0 },
  });

  const linkRef = useRef<Mesh>(null!);

  const isHovered = useRef(false);
  const [isHoveredD, setIsHovered] = useState(false);

  useFrame((_, delta) => {
    uniforms.current.time.value += delta / (isHovered.current ? 1.5 : 8.0);
  });

  useCursor(isHoveredD, "pointer", "auto");

  const shaderMaterial = new ShaderMaterial({
    vertexShader: textShader,
    fragmentShader: `
      varying vec2 vUv;
      void main() { 
        gl_FragColor = vec4(${color}, 1.0);
      }
    `,
    transparent: true,
    uniforms: uniforms.current,
  });
  return (
    <Text
      ref={linkRef}
      position={position}
      /*       font={"fonts/Lacquer-Regular.ttf"} */
      font={"fonts/Boogaloo-Regular.ttf"}
      material={shaderMaterial}
      onPointerEnter={() => {
        isHovered.current = true;
        setIsHovered(true);
        const positionInWorld = linkRef.current.getWorldPosition(new Vector3());

        targetPosition.current = new Vector3(
          positionInWorld.x,
          positionInWorld.y,
          positionInWorld.z
        );
      }}
      onPointerLeave={() => {
        isHovered.current = false;
        setIsHovered(false);
        targetPosition.current = null; // Reset target position when not hovered
      }}
      {...rest}
    >
      {text}
    </Text>
  );
};

type NavProps = {
  targetposition: RefObject<Vector3 | null>; // Not used in this example, but can be used for navigation
};

const Nav = ({ targetposition }: NavProps) => {
  return (
    <group position={[0, 4, 0]}>
      <NavLink
        text="PORTFOLIO"
        color={"1.0, 1.0, 1.0"}
        targetPosition={targetposition}
        position={new Vector3(-4, 0, 0)}
      />
      <NavLink
        text="CV"
        color={"1.0, 1.0, 1.0"}
        targetPosition={targetposition}
        position={new Vector3(0, 0, 0)}
      />
      {/*       <NavLink
        text="SEBKAH"
        fillOpacity={0.7}
        color={"0.631, 0.761, 0.808"}
        targetPosition={targetposition}
        fontSize={10}
        position={new Vector3(0, 5, -80)}
      /> */}
      {/*       <NavLink
      text="SEBKAH"
      fillOpacity={1}
     
      strokeColor="#ffffff"
      targetPosition={targetposition}
      fontSize={3}
      position={new Vector3(-3, -3, -2)}
      /> */}
    </group>
  );
};

const Dolly = () => {
  /*   const { pointer } = useThree(); */
  useFrame(({ camera, pointer }) => {
    const basePosition = [-3, 0.75, 20] as const; // Base camera position
    const offsetX = pointer.x * 0.2; // Adjust sensitivity as needed
    const offsetY = pointer.y * 0.2; // Adjust sensitivity as needed

    // Target position
    const targetPosition = new Vector3(
      basePosition[0] + offsetX,
      basePosition[1] + offsetY,
      basePosition[2] + offsetY * 10
    );

    // Lerp factor (0.1 = smooth, 1.0 = instant)
    const lerpFactor = 0.05;

    // Lerp between current and target position
    camera.position.lerp(targetPosition, lerpFactor);
  });

  return null;
};

export default function ThreeBackground() {
  const targetPosition = useRef<Vector3>(null);
  return (
    <div className="fixed inset-0 pointer-events-auto">
      {/* Three.js Canvas */}
      <Canvas
        className="pointer-events-auto"
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = NoToneMapping;
          // Very Light blue fog
          /*  scene.fog = new FogExp2(0xadd8e6, 0.01); */ // Light blue fog
        }}
      >
        <EffectComposer>
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL} // blend mode
            offset={[0.0008, 0.0008]}
          />

          <Vignette eskil={false} offset={0.2} darkness={0.6} />

          <Noise
            premultiply // enables or disables noise premultiplication
            blendFunction={BlendFunction.SCREEN} // blend mode
            opacity={0.7}
          />
          {/*          <DepthOfField
            focusDistance={1} // where to focus
            focalLength={0.5} // focal length
            bokehScale={10} // bokeh size
          /> */}
        </EffectComposer>

        <Dolly />
        <Scene />
        <Nav targetposition={targetPosition} />
        <group rotation={[0, Math.PI / -2, 0]}>
          <Boat />
          <Birds targetPosition={targetPosition} />
        </group>
      </Canvas>
    </div>
  );
}
