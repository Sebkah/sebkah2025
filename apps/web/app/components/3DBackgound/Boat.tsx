import { useGLTF } from "@react-three/drei";

export default function Boat() {
  const { nodes } = useGLTF("3d/boat_lighter.gltf");

  if (!nodes || !nodes.Scene) return null;
  return <primitive object={nodes.Scene} />;
}
