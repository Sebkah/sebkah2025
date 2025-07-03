"use client";

import { useFrame } from "@react-three/fiber";
import { Text, TextProps, Trail, useCursor } from "@react-three/drei";
import { Mesh, ShaderMaterial, Vector3 } from "three";
import { RefObject, useRef, useState, useMemo } from "react";
import textShader from "./text.vert";

import { useRouter } from "next/navigation";

export type NavLinkProps = Omit<TextProps, "children"> & {
  text: string;
  color: string; // Color in the format "0.1, 0.2, 0.3" (RGB)
  href?: string;
  targetPosition: RefObject<Vector3 | null>;
};

export const NavLink = ({
  color,
  text,
  position,
  targetPosition,

  ...rest
}: NavLinkProps) => {
  const router = useRouter();

  const uniforms = useRef({
    time: { value: 1.0 },
  });

  const linkRef = useRef<Mesh>(null!);
  const isHovered = useRef(false);
  const [isHoveredState, setIsHoveredState] = useState(false);

  useFrame((_, delta) => {
    uniforms.current.time.value += delta / (isHovered.current ? 1.5 : 8.0);
  });

  useCursor(isHoveredState, "pointer", "auto");

  // Memoize shader material to prevent recreation on every render
  const shaderMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: textShader,
        fragmentShader: `
          varying vec2 vUv;
          void main() { 
            gl_FragColor = vec4(${color}, vUv.y * 1.5 - 0.1);
          }
        `,
        transparent: true,
        uniforms: uniforms.current,
      }),
    [color]
  );

  const handlePointerEnter = () => {
    isHovered.current = true;
    setIsHoveredState(true);
    const positionInWorld = linkRef.current.getWorldPosition(new Vector3());

    targetPosition.current = new Vector3(
      positionInWorld.x,
      positionInWorld.y,
      positionInWorld.z
    );
  };

  const handlePointerLeave = () => {
    isHovered.current = false;
    setIsHoveredState(false);
    targetPosition.current = null;
  };

  return (
    <Text
      ref={linkRef}
      position={position}
      font={"fonts/Boogaloo-Regular.ttf"}
      material={shaderMaterial}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={() => {
        if (rest.href) {
          router.push(rest.href);
        }
      }}
      {...rest}
    >
      {text}
    </Text>
  );
};

export type NavProps = {
  targetPosition: RefObject<Vector3 | null>;
};

export const Nav = ({ targetPosition }: NavProps) => {
  return (
    <group position={[0, 4, 0]}>
      <NavLink
        text="PORTFOLIO"
        href="/portfolio"
        color="1.0, 1.0, 1.0"
        targetPosition={targetPosition}
        position={new Vector3(-4, 0, 0)}
      />
      <NavLink
        text="CV"
        href="/cv"
        color="1.0, 1.0, 1.0"
        targetPosition={targetPosition}
        position={new Vector3(0, 0, 0)}
      />
      {/*   <NavLink
        text="SEBKAH"
        fillOpacity={0.7}
        color={"0.631, 0.761, 0.808"}
        targetPosition={targetPosition}
        fontSize={10}
        position={new Vector3(0, 5, -80)}
      /> */}
      {/*  <NavLink
        text="SEBKAH"
        fillOpacity={0.4}
        color={"1.0, 1.0, 1.0"}
        targetPosition={targetPosition}
        fontSize={25}
        position={new Vector3(-3, 10, -80)}
      /> */}
      {/*      <NavLink
        text="SEBKAH"
        color="0.631, 0.761, 0.808"
        fillOpacity={1}
        strokeColor="#ffffff"
        targetPosition={targetPosition}
        fontSize={3}
        position={new Vector3(-3, -3, -2)}
      /> */}
    </group>
  );
};
