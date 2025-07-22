// Set of functions to help with camera operations in a Three.js scene

import { Euler, PerspectiveCamera, Quaternion, Vector3 } from "three";

type Waypoint = {
  name: string;
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
};

export class SimpleCameraControls {
  camera: PerspectiveCamera;
  private waypoints: Waypoint[] = [];

  constructor(_camera: PerspectiveCamera) {
    this.camera = _camera;
  }

  rotateLerp(
    eulerAngles: readonly [number, number, number],
    lerpFactor: number = 0.1
  ) {
    const cameraCurrentRotation = this.camera.quaternion.clone();

    const targetRotation = new Quaternion().setFromEuler(
      new Euler(...eulerAngles)
    );

    // Smoothly interpolate camera rotation
    cameraCurrentRotation.slerp(targetRotation, lerpFactor);

    this.camera.quaternion.copy(cameraCurrentRotation);
  }

  addWaypoint(
    name: string,
    position: readonly [number, number, number],
    rotation: readonly [number, number, number]
  ) {
    this.waypoints.push({
      name,
      position,
      rotation,
    });
  }

  lerpToWaypoint(
    waypointName: string,
    lerpFactor: number = 0.1,
    adjustPosition: [number, number, number] = [0, 0, 0]
  ) {
    const waypoint = this.waypoints.find((wp) => wp.name === waypointName);
    if (!waypoint) return;
    this.camera.position.lerp(
      new Vector3(...waypoint.position).add(new Vector3(...adjustPosition)),
      lerpFactor
    );
    this.rotateLerp(
      waypoint.rotation as readonly [number, number, number],
      lerpFactor
    );
  }
}
