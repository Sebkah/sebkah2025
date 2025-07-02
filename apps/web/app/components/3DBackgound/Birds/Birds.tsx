import vert from "./shaders/bird.vert";
import frag from "./shaders/bird.frag";
import { useGLTF } from "@react-three/drei"; // shaders.d.ts provides typings for .vert and .frag modules
import { RefObject, use, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, ShaderMaterial, Vector3 } from "three";
import { or } from "three/tsl";
import { time } from "console";

type BirdState = {
  position: Vector3;
  velocity: Vector3;
};

export default function Birds({
  targetPosition,
}: {
  targetPosition: RefObject<Vector3 | null>;
}) {
  const shader = new ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
  });

  const flockRef = useRef<BirdState[]>([]);

  return (
    <group>
      {[...Array(400).fill(0)].map((e, index) => {
        return (
          <Bird
            id={index}
            key={index}
            targetPosition={targetPosition}
            flockRef={flockRef}
          />
        );
      })}
    </group>
  );
}

type BirdProps = {
  id: number;
  flockRef: React.RefObject<BirdState[]>;
  targetPosition: RefObject<Vector3 | null>; // Not used in this example, but can be used for navigation
};

const Bird = ({ id, flockRef, targetPosition }: BirdProps) => {
  const bird = useGLTF("/3d/bird.gltf").nodes;
  const uniforms = useRef({
    time: { value: 1.0 },
  });

  const birdRef = useRef<Group>(null!);

  const start = useRef(Math.random() * 1000);

  const acc = useRef(new Vector3(0, 0, 0));
  const vel = useRef(new Vector3(0, 0, 0));
  const pos = useRef(
    new Vector3(Math.random() * 3 + 1, id / 70 - 0.1, Math.random() * 2 - 1)
  ); // Randomize initial position
  const prevPos = useRef(new Vector3(0, 0, 0));

  // Initialize the flock state if not already done
  if (!flockRef.current[id]) {
    flockRef.current[id] = {
      position: pos.current,
      velocity: vel.current,
    };
  }

  useFrame((state) => {
    uniforms.current.time.value = state.clock.getElapsedTime() + start.current;

    const timeScaled = state.clock.elapsedTime / 2;

    const timeSlowed = timeScaled / 4; // Slowing down the time for smoother motion

    //Select 1/3 of the birds
    const isSelected = id % 3 === 0;

    // Store previous position before updating
    prevPos.current.copy(pos.current);

    // 1. Circular Motion Force
    const circularForce = circularMotionForce(
      timeScaled,
      start.current,
      pos.current,
      targetPosition.current
        ? 0
        : !isSelected
          ? 0.1
          : Math.sin(timeScaled) * 0.1 // Adjust the strength of the circular force as needed
    );

    // 2. Flocking Force
    const flockForce = flockingForce(
      flockRef,
      pos.current,
      1 // Adjust the strength of the flocking force as needed
    );

    // 2. Applying forces
    // Resert acceleration
    acc.current.set(0, 0, 0);
    // Apply base circular force
    acc.current.add(circularForce);
    // Apply flocking force
    acc.current.add(flockForce);

    // Target position force
    if (targetPosition.current) {
      const worldPosition = birdRef.current.getWorldPosition(new Vector3());

      const toTargetDirection = targetPosition.current
        .clone()
        .sub(worldPosition);

      acc.current.add(toTargetDirection.multiplyScalar(0.1)); // Adjust the strength of the force towards the target position
    }

    // Add a slight upward force if the bird is too low
    if (pos.current.y < 0.5) acc.current.y += 0.1;

    // 3. Integrating
    // Update velocity and position
    vel.current.add(acc.current);
    vel.current.clampLength(-0.01, 0.02); // Limit speed
    pos.current.add(vel.current);

    // 3. Update the bird's position and rotation
    if (birdRef.current) {
      birdRef.current.position.copy(pos.current);

      //Convert position to world coordinates
      const worldPosition = birdRef.current.getWorldPosition(new Vector3());

      // Look at the direction of movement
      birdRef.current.lookAt(vel.current.clone().add(worldPosition));
    }
  });

  return (
    <group ref={birdRef}>
      <mesh geometry={(bird.birdie as any).geometry} scale={0.05} castShadow>
        <shaderMaterial
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={uniforms.current}
        />
      </mesh>
    </group>
  );
};

const flockingForce = (
  flockRef: React.RefObject<BirdState[]>,
  pos: Vector3,
  strength: number
): Vector3 => {
  const cohesion = new Vector3(0, 0, 0);
  const separation = new Vector3(0, 0, 0);
  const alignment = new Vector3(0, 0, 0);
  const perceptionRadius = 0.3; // Radius to consider other birds

  /* console.log(flockRef.current); */

  if (!flockRef.current || flockRef.current.length === 0) {
    return new Vector3(0, 0, 0); // No birds to flock with
  }

  let total = 0;
  flockRef.current.forEach((bird, index) => {
    if (
      bird.position.distanceTo(pos) < perceptionRadius &&
      bird.position !== pos
    ) {
      // Cohesion: Move towards the average position of nearby birds
      cohesion.add(bird.position);
      total++;
      // Separation: Move away from nearby birds to avoid crowding
      const diff = pos.clone().sub(bird.position);
      separation.add(
        diff.normalize().divideScalar(bird.position.distanceTo(pos))
      );

      // Alignment: Match the average direction of nearby birds
      alignment.add(bird.velocity);
    }
  });
  if (total > 0) {
    cohesion
      .divideScalar(total)
      .sub(pos)
      .normalize()
      .multiplyScalar(strength / 10);
    separation.multiplyScalar(strength).multiplyScalar(1 / 100);
    alignment.divideScalar(total).normalize().multiplyScalar(strength);
  }
  return cohesion.add(separation).add(alignment);
};

const toCenterForce = (pos: Vector3, strength: number): Vector3 => {
  const center = new Vector3(0, 0, 0); // Center of the scene
  const targetDirection = center.clone().sub(pos);

  // Make it stronger if the bird is too far from the center
  if (targetDirection.length() > 1) {
    targetDirection.multiplyScalar(100000); // Increase the force if too far
  }

  return targetDirection.multiplyScalar(strength); // Adjust the force magnitude as needed
};

const circularMotionForce = (
  elapsedTime: number,
  timeDelta: number,
  pos: Vector3,
  strength: number
): Vector3 => {
  const radius = 15; // Radius of the circular path
  // Calculate the position based on sine and cosine functions for circular motion
  const targetPosition = new Vector3(
    Math.sin(elapsedTime + timeDelta) * radius + 3,
    Math.cos(elapsedTime + timeDelta),
    Math.cos(elapsedTime + timeDelta) * radius
  );

  const targetDirection = targetPosition.clone().sub(pos);
  targetDirection.normalize();

  return targetDirection.multiplyScalar(
    strength * Math.pow(Math.sin(elapsedTime + timeDelta / 1000), 2)
  ); // Adjust the force magnitude as needed
};
