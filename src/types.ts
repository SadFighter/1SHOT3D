export type PrimitiveKind = 'box' | 'sphere' | 'plane' | 'cylinder';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SceneObject {
  id: string;
  kind: PrimitiveKind;
  position: Vec3;
  rotation: Vec3; // radians
  scale: Vec3;
  color: string; // #rrggbb
}

export type GizmoMode = 'translate' | 'rotate' | 'scale';

export interface ScenePayload {
  version: 1;
  camera: { position: Vec3; target: Vec3 };
  objects: SceneObject[];
}