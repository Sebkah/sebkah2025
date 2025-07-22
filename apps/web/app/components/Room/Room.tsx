import {
  MeshTransmissionMaterial,
  MeshTransmissionMaterialProps,
  useGLTF,
} from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { MeshStandardMaterial, Mesh, Texture } from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { useRef } from "react";

import screenFrag from "./shaders/screen.frag";
import screenVert from "./shaders/screen.vert";
import topFrag from "./shaders/top.frag";
import topVert from "./shaders/top.vert";
import { s } from "framer-motion/client";

// Type guard to check if material is MeshStandardMaterial
const isMeshStandardMaterial = (
  material: any
): material is MeshStandardMaterial => {
  return material instanceof MeshStandardMaterial;
};

export const Room = () => {
  // Load the GLTF model
  const room = useGLTF("./3d/room.glb", true);

  // Extract meshes from the GLTF scene
  const screen = room.scenes[0]?.children.find(
    (child) => child.name === "screen"
  ) as Mesh;

  const capo = room.scenes[0]?.children.find(
    (child) => child.name === "platbox001"
  ) as Mesh;

  const couv = capo?.children.find((child) => child.name === "capo") as Mesh;

  // Configure screen material if it exists and is the right type
  if (screen?.material && isMeshStandardMaterial(screen.material)) {
    screen.material.emissiveIntensity = 4;
  }

  const { scene, size } = useThree();

  // Shader uniforms for screen material
  const screenUniforms = useRef({
    time: { value: 0 },
    resolution: { value: [window.innerWidth, window.innerHeight] },
    emissiveMap: {
      value:
        screen?.material && isMeshStandardMaterial(screen.material)
          ? screen.material.emissiveMap
          : null,
    },
  });

  // Shader uniforms for top material
  const topUniforms = useRef({
    time: { value: 0 },
    resolution: { value: [size.width, size.height] },
    emissiveMap: { value: scene.userData?.renderTarget?.texture || null },
    cameraPosition: { value: [0, 0, 0] },
  });

  // Animation frame loop
  useFrame((state, delta) => {
    // Update time uniforms
    screenUniforms.current.time.value += delta;
    topUniforms.current.time.value += delta;

    // Update resolution uniforms
    topUniforms.current.resolution.value = [size.width, size.height];
    screenUniforms.current.resolution.value = [
      state.size.width,
      state.size.height,
    ];

    // Update emissive map for top material after initial frame
    if (
      screenUniforms.current.time.value < 0.1 &&
      scene.userData?.renderTarget?.texture
    ) {
      topUniforms.current.emissiveMap.value =
        scene.userData.renderTarget.texture;
    }

    // Update camera position
    topUniforms.current.cameraPosition.value = state.camera.position.toArray();
  });

  return (
    <group position={[-3, -5, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Main room scene */}
      {room.scenes[1] && (
        <primitive object={room.scenes[1]} dispose={null}>
          <meshStandardMaterial color="lightblue" />
        </primitive>
      )}

      {/* Top cover with shader material */}
      {couv && capo && (
        <group position={capo.position} rotation={capo.rotation} dispose={null}>
          <mesh
            geometry={couv.geometry}
            position={couv.position}
            rotation={couv.rotation}
            scale={couv.scale}
          >
            <shaderMaterial
              side={2}
              uniforms={topUniforms.current}
              fragmentShader={topFrag}
              vertexShader={topVert}
            />
          </mesh>
        </group>
      )}

      {/* Screen with shader material */}
      {screen && (
        <mesh
          geometry={screen.geometry}
          position={screen.position}
          rotation={screen.rotation}
          scale={screen.scale}
        >
          <shaderMaterial
            side={2}
            uniforms={screenUniforms.current}
            fragmentShader={screenFrag}
            vertexShader={screenVert}
          />
        </mesh>
      )}
    </group>
  );
};
