import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls } from '@react-three/drei';
import { SceneObjectMesh } from './SceneObjectMesh';
import type { GizmoMode, SceneObject } from '../types';

interface Props {
  objects: SceneObject[];
  selectedId: string | null;
  gizmoMode: GizmoMode;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<SceneObject>) => void;
}

export function Viewport({ objects, selectedId, gizmoMode, onSelect, onUpdate }: Props) {
  const selected = objects.find((o) => o.id === selectedId) ?? null;

  return (
    <Canvas
      camera={{ position: [4, 3, 6], fov: 50 }}
      onPointerMissed={() => onSelect(null)}
      shadows
    >
      <color attach="background" args={['#1a1a1f']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
      <Grid args={[20, 20]} cellColor="#333" sectionColor="#555" infiniteGrid fadeDistance={30} />

      {objects.map((obj) => (
        <SceneObjectMesh
          key={obj.id}
          obj={obj}
          selected={obj.id === selectedId}
          onSelect={() => onSelect(obj.id)}
          onChange={(patch) => onUpdate(obj.id, patch)}
        />
      ))}

      {selected && (
        <TransformControls
          mode={gizmoMode}
          object={undefined}
          onObjectChange={(e) => {
            const target = (e as any)?.target?.object;
            if (!target) return;
            onUpdate(selected.id, {
              position: { x: target.position.x, y: target.position.y, z: target.position.z },
              rotation: { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
              scale: { x: target.scale.x, y: target.scale.y, z: target.scale.z },
            });
          }}
        >
          <group
            position={[selected.position.x, selected.position.y, selected.position.z]}
            rotation={[selected.rotation.x, selected.rotation.y, selected.rotation.z]}
            scale={[selected.scale.x, selected.scale.y, selected.scale.z]}
          />
        </TransformControls>
      )}

      <OrbitControls makeDefault enableDamping />
    </Canvas>
  );
}