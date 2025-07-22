import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RefObject, useMemo, useRef } from "react";
import { InstancedMesh, Object3D, Vector3 } from "three";

import vert from "./shaders/bird.vert";
import frag from "./shaders/bird.frag";
import { calculateCircularMotionForce, calculateFlockingForce, calculateHeightConstraintForce, calculateTargetForce } from "./Birds";

type BirdsInstancedProps = {
  targetPosition: RefObject<Vector3 | null>;
};

// Configuration constants
const BIRD_COUNT = 200;
const PERCEPTION_RADIUS = 0.35;
const PERCEPTION_RADIUS_SQUARED = PERCEPTION_RADIUS * PERCEPTION_RADIUS;
const MAX_SPEED = 0.01;
const MIN_SPEED = -0.01;
const MIN_HEIGHT = 0.5;
const CIRCULAR_RADIUS = 15;

// Force strength constants
const FLOCKING_STRENGTH = 1;
const TARGET_FORCE_STRENGTH = 0.1;
const UPWARD_FORCE_STRENGTH = 0.1;

type BirdState = {
  position: Vector3;
  velocity: Vector3;
  previousChunkKey: number | null;
  gotToGround: boolean;
  animationOffset: number;
};

// Shared flock state
const flockState: BirdState[] = Array.from({ length: BIRD_COUNT }, (_, i) => ({
  position: createInitialPosition(i),
  velocity: new Vector3(0, 0, 0),
  previousChunkKey: null,
  gotToGround: false,
  animationOffset: Math.random() * 1000, // Random offset for each bird
}));

const flockChunks: Map<number, Set<number>> = new Map();
const emptyChunks: Set<number> = new Set(); // Pool of empty chunks for reuse
const setPool: Set<number>[] = []; // Pool of reusable Set objects
let lastCleanupTime = 0;
const CLEANUP_INTERVAL = 1000; // Cleanup every 1 second

// Helper functions for set pooling
const getPooledSet = (): Set<number> => {
  return setPool.pop() || new Set<number>();
};

const returnSetToPool = (set: Set<number>) => {
  set.clear();
  if (setPool.length < 50) {
    // Limit pool size to prevent memory bloat
    setPool.push(set);
  }
};

const createInitialPosition = (id: number): Vector3 => {
  return new Vector3(
    Math.random() * 3 + 1,
    id / 70 - 0.1,
    Math.random() * 2 - 1
  );
};

export const BirdsInstanced = ({ targetPosition }: BirdsInstancedProps) => {
  const bird = useGLTF("/3d/bird.gltf").nodes;
  const instancedMeshRef = useRef<InstancedMesh>(null);

  // Create dummy object for matrix calculations
  const dummy = useMemo(() => new Object3D(), []);

  useFrame((state) => {
    // Chunk management

    const currentTime = state.clock.elapsedTime * 1000;
    if (currentTime - lastCleanupTime > CLEANUP_INTERVAL) {
      lastCleanupTime = currentTime;
      emptyChunks.forEach((chunkKey) => {
        const chunk = flockChunks.get(chunkKey);
        if (chunk && chunk.size === 0) {
          flockChunks.delete(chunkKey);
          returnSetToPool(chunk); // Return empty set to pool for reuse
        }
      });
      emptyChunks.clear();
    }

    const timeScaled = state.clock.elapsedTime / 2;

    flockState.forEach((birdState, id) => {
      const {
        position,
        velocity,
        previousChunkKey,
        gotToGround,
        animationOffset,
      } = birdState;
      // Remove bird from previous chunk (if it had one)
      if (previousChunkKey !== null) {
        const previousChunk = flockChunks.get(previousChunkKey);
        if (previousChunk) {
          previousChunk.delete(id);
          if (previousChunk.size === 0) {
            // Mark chunk as empty but don't delete immediately
            emptyChunks.add(previousChunkKey);
          }
        }
      }

      // Select every 3rd bird for special behavior
      const isSelectedBird = false;

      // 1. Calculate circular motion force
      const circularStrength = targetPosition.current
        ? 0
        : isSelectedBird
          ? Math.sin(timeScaled) * 0.1
          : 0.1;

      const circularForce =
        circularStrength > 0
          ? calculateCircularMotionForce(
              timeScaled,
              animationOffset,
              position,
              circularStrength
            )
          : new Vector3(0, 0, 0);

      // 2. Calculate flocking force
      const flockForce = calculateFlockingForce(position, FLOCKING_STRENGTH);

      // 3. Calculate target force
      const targetForce =
        targetPosition.current && birdRef.current
          ? calculateTargetForce(
              targetPosition.current,
              birdRef.current,
              TARGET_FORCE_STRENGTH
            )
          : new Vector3(0, 0, 0);

      // 4. Calculate height constraint force
      const heightForce = calculateHeightConstraintForce(
        position.current,
        UPWARD_FORCE_STRENGTH
      );

      const shouldBirdBeOnGround =
        Math.sin(timeScaled / 10 + animationStartTime.current) > 0.8;
    });
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[(bird.birdie as any).geometry, undefined, BIRD_COUNT]}
      castShadow
      receiveShadow
    >
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{
          time: { value: 1.0 },
        }}
      />
    </instancedMesh>
  );
};
