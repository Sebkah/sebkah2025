import vert from "./shaders/bird.vert";
import frag from "./shaders/bird.frag";
import { Trail, useGLTF } from "@react-three/drei"; // shaders.d.ts provides typings for .vert and .frag modules
import { RefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferGeometry,
  Group,
  NormalBufferAttributes,
  ShaderMaterial,
  Vector3,
} from "three";
import { get } from "http";
import { a } from "framer-motion/client";

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
};

// Shared flock state
const flockState: BirdState[] = [];

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

/**
 * Birds component that renders a flock of animated birds using flocking behavior
 * @param targetPosition - Optional target position for birds to move towards
 */
export default function Birds({
  targetPosition,
}: {
  targetPosition: RefObject<Vector3 | null>;
}) {
  const bird = useGLTF("/3d/bird.gltf").nodes;
  // Handle cleanup once per frame instead of per bird
  useFrame((state) => {
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

    // Log the number of chunks for debugging
    /*    console.log(
      `Current flock chunks: ${flockChunks.size}, current empty: ${emptyChunks.size}`
    ); */
  });

  return (
    <group>
      {Array.from({ length: BIRD_COUNT }, (_, index) => (
        <Bird
          geometry={(bird.birdie as any).geometry}
          id={index}
          key={index}
          targetPosition={targetPosition}
        />
      ))}
    </group>
  );
}

type BirdProps = {
  id: number;
  targetPosition: RefObject<Vector3 | null>;
  geometry: BufferGeometry<NormalBufferAttributes>; // Optional geometry prop for future use
};

/**
 * Individual bird component with flocking behavior and physics simulation
 */
const Bird = ({ id, targetPosition, geometry }: BirdProps) => {
  const uniforms = useRef({
    time: { value: 1.0 },
  });

  const birdRef = useRef<Group>(null!);
  const animationStartTime = useRef(Math.random() * 1000);

  // Physics state
  const acceleration = useRef(new Vector3(0, 0, 0));
  const velocity = useRef(new Vector3(0, 0, 0));
  const position = useRef(createInitialPosition(id));
  const previousChunkKey = useRef<number | null>(null);

  flockState[id] = {
    position: position.current,
    velocity: velocity.current,
  };

  const randomGroundPosition = useRef(
    new Vector3(Math.random() * 4 + 1, 0.05, Math.random() * 10 - 1)
  );

  let gotToGround = false;

  useFrame((state) => {
    // Remove bird from previous chunk (if it had one)
    if (previousChunkKey.current !== null) {
      const previousChunk = flockChunks.get(previousChunkKey.current);
      if (previousChunk) {
        previousChunk.delete(id);
        if (previousChunk.size === 0) {
          // Mark chunk as empty but don't delete immediately
          emptyChunks.add(previousChunkKey.current);
        }
      }
    }

    const timeScaled = state.clock.elapsedTime / 2;
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
            animationStartTime.current,
            position.current,
            circularStrength
          )
        : new Vector3(0, 0, 0);

    // 2. Calculate flocking force
    const flockForce = calculateFlockingForce(
      position.current,
      FLOCKING_STRENGTH
    );

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

    // 5. Apply all forces to acceleration
    acceleration.current.set(0, 0, 0);
    if (!shouldBirdBeOnGround) {
      acceleration.current.add(circularForce);
      acceleration.current.add(flockForce);
      acceleration.current.add(targetForce);
      acceleration.current.add(heightForce);

      if (gotToGround) gotToGround = false; // Reset ground state if bird is flying

      // Update shader animation time
      uniforms.current.time.value =
        state.clock.getElapsedTime() + animationStartTime.current;
    } else {
      // If bird should be on ground, apply a force towards a random ground position
      uniforms.current.time.value = 525; // Reset time for ground birds
      const groundPosition = randomGroundPosition.current;
      const toGroundDirection = groundPosition
        .clone()
        .sub(position.current)
        .normalize();

      // If the bird is not already at the ground position, apply a small force towards it
      if (
        position.current.distanceToSquared(groundPosition) > 0.01 &&
        !gotToGround
      ) {
        acceleration.current.add(toGroundDirection.multiplyScalar(0.1));
      }
      // If the bird is close to the ground position, make it wiggle around it
      else {
        gotToGround = true; // Mark as reached ground position
      }

      // If the bird is on the ground make walk a little using a sine wave
      if (gotToGround) {
        velocity.current.set(0, 0, 0); // Reset velocity when on ground
        acceleration.current.set(0, 0, 0); // Reset acceleration when on ground

        // Wiggle around the ground position
        position.current.x += (Math.random() - 0.5) * 0.006; // Small random x offset
        position.current.z += (Math.random() - 0.5) * 0.006; // Small random z offset
        position.current.y = 0.06; // Keep it on the ground
      }
    }

    const speedFactor = targetPosition.current ? 2 : 1;

    // 6. Update physics (velocity and position)
    velocity.current.add(acceleration.current);
    velocity.current.clampLength(MIN_SPEED, MAX_SPEED * speedFactor);
    position.current.add(velocity.current);

    // 7. Update bird's transform
    if (birdRef.current) {
      birdRef.current.position.copy(position.current);

      // Convert position to world coordinates and look at movement direction
      const worldPosition = birdRef.current.getWorldPosition(new Vector3());

      birdRef.current.lookAt(velocity.current.clone().add(worldPosition));
    }

    // 8. Update flock chunks
    const currentChunkKey = getChunkKey(position.current);
    if (!flockChunks.has(currentChunkKey)) {
      // Reuse pooled Set if available, otherwise create new Set
      const chunkSet = getPooledSet();
      flockChunks.set(currentChunkKey, chunkSet);
    }
    // Remove from empty chunks if it was marked as empty
    emptyChunks.delete(currentChunkKey);
    flockChunks.get(currentChunkKey)!.add(id);

    // Update the previous chunk key for next frame
    previousChunkKey.current = currentChunkKey;
  });

  return (
    <group ref={birdRef}>
      <mesh geometry={geometry} scale={0.05} castShadow receiveShadow>
        <shaderMaterial
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={uniforms.current}
        />
      </mesh>
    </group>
  );
};

const chunkSize = 0.2; // Size of each chunk in the grid

const getChunkKey = (position: Vector3): number => {
  const x = Math.floor(position.x / chunkSize);
  const y = Math.floor(position.y / chunkSize);
  const z = Math.floor(position.z / chunkSize);
  // Hash function for 3D coordinates
  return (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
};

const getChunkCoordinates = (position: Vector3): [number, number, number] => {
  const x = Math.floor(position.x / chunkSize);
  const y = Math.floor(position.y / chunkSize);
  const z = Math.floor(position.z / chunkSize);
  return [x, y, z];
};

const getChunkKeyFromCoordinates = (
  x: number,
  y: number,
  z: number
): number => {
  // Hash function for 3D coordinates
  return (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
};

const getNeighboringChunks = (position: Vector3): Set<number> => {
  const chunkKey = getChunkKey(position);
  const neighbors = new Set<number>();
  const [x, y, z] = getChunkCoordinates(position);
  // Check all 26 neighboring chunks in a 3D grid
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        const neighborKey = getChunkKeyFromCoordinates(x + dx, y + dy, z + dz);

        // If the neighbor chunk exists, add its birds to the set
        if (flockChunks.has(neighborKey)) {
          const neighborChunk = flockChunks.get(neighborKey)!;
          neighborChunk.forEach((birdId) => neighbors.add(birdId));
        }
      }
    }
  }
  return neighbors;
};

/**
 * Calculates flocking forces based on three classic boids behaviors:
 * 1. Cohesion - move towards the average position of nearby birds
 * 2. Separation - avoid crowding by moving away from very close birds
 * 3. Alignment - match the average direction of nearby birds
 */
export const calculateFlockingForce = (
  currentPosition: Vector3,
  strength: number
): Vector3 => {
  const cohesion = new Vector3(0, 0, 0);
  const separation = new Vector3(0, 0, 0);
  const alignment = new Vector3(0, 0, 0);

  let nearbyBirdsCount = 0;

  // Collect all birds in neighboring chunks
  const neighboringBirds = getNeighboringChunks(currentPosition);

  /*  console.log(neighboringBirds.size); */

  neighboringBirds.forEach((birdIndex) => {
    const bird = flockState[birdIndex] as BirdState;
    const distanceSquared = bird.position.distanceToSquared(currentPosition);

    if (
      distanceSquared < PERCEPTION_RADIUS_SQUARED &&
      bird.position !== currentPosition
    ) {
      // Cohesion: Move towards the average position of nearby birds
      cohesion.add(bird.position);
      nearbyBirdsCount++;

      // Separation: Move away from nearby birds to avoid crowding
      const separationVector = currentPosition.clone().sub(bird.position);
      const distance = Math.sqrt(distanceSquared); // Only calculate actual distance when needed
      separation.add(separationVector.normalize().divideScalar(distance));

      // Alignment: Match the average direction of nearby birds
      alignment.add(bird.velocity);
    }
  });

  if (nearbyBirdsCount > 0) {
    // Apply cohesion force
    cohesion
      .divideScalar(nearbyBirdsCount)
      .sub(currentPosition)
      .normalize()
      .multiplyScalar(strength / 10);

    // Apply separation force
    separation.multiplyScalar(strength / 100);

    // Apply alignment force
    alignment
      .divideScalar(nearbyBirdsCount)
      .normalize()
      .multiplyScalar(strength);
  }

  return cohesion.add(separation).add(alignment);
};

/**
 * Calculates a force that attracts birds towards the center of the scene
 * Increases force significantly if birds are too far from center
 */
export const calculateCenteringForce = (
  currentPosition: Vector3,
  strength: number
): Vector3 => {
  const center = new Vector3(0, 0, 0);
  const targetDirection = center.clone().sub(currentPosition);

  // Increase force dramatically if bird is too far from center
  if (targetDirection.length() > 1) {
    targetDirection.multiplyScalar(100000);
  }

  return targetDirection.multiplyScalar(strength);
};

/**
 * Generates a circular motion force to create flowing, organic movement patterns
 */
export const calculateCircularMotionForce = (
  elapsedTime: number,
  timeDelta: number,
  currentPosition: Vector3,
  strength: number
): Vector3 => {
  // Calculate the target position based on sine and cosine functions for circular motion
  const targetPosition = new Vector3(
    Math.sin(elapsedTime + timeDelta) * CIRCULAR_RADIUS + 3,
    Math.cos(elapsedTime + timeDelta),
    Math.cos(elapsedTime + timeDelta) * CIRCULAR_RADIUS
  );

  const targetDirection = targetPosition.clone().sub(currentPosition);
  targetDirection.normalize();

  // Apply oscillating strength based on sine wave
  const oscillatingStrength = Math.pow(
    Math.sin(elapsedTime + timeDelta / 1000),
    2
  );
  return targetDirection.multiplyScalar(strength * oscillatingStrength);
};

/**
 * Calculates force towards a target position
 */
export const calculateTargetForce = (
  targetPosition: Vector3,
  birdGroup: Group,
  strength: number
): Vector3 => {
  const worldPosition = birdGroup.getWorldPosition(new Vector3());
  const toTargetDirection = targetPosition.clone().sub(worldPosition);
  return toTargetDirection.multiplyScalar(strength);
};

/**
 * Calculates upward force to keep birds above minimum height
 */
export const calculateHeightConstraintForce = (
  currentPosition: Vector3,
  strength: number
): Vector3 => {
  const force = new Vector3(0, 0, 0);
  if (currentPosition.y < MIN_HEIGHT) {
    force.y = strength;
  }
  return force;
};

/**
 * Creates a randomized initial position for a bird
 */
export const createInitialPosition = (id: number): Vector3 => {
  return new Vector3(
    Math.random() * 3 + 1,
    id / 70 - 0.1,
    Math.random() * 2 - 1
  );
};
