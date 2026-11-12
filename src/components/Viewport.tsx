import { useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
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
  // Store a map of all 3D meshes so the gizmo can grab them directly by ID
  const meshRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  // Dummy state to force a re-render when the map updates so `selectedMesh` is found
  const [, setTick] = useState(0);

  const setMeshRef = useCallback((id: string, mesh: THREE.Mesh | null) => {
    if (mesh) {
      meshRefs.current.set(id, mesh);
    } else {
      meshRefs.current.delete(id);
    }
    setTick((t) => t + 1);
  }, []);

  const selected = objects.find((o) => o.id === selectedId);
  const selectedMesh = selected ? meshRefs.current.get(selected.id) : null;

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
          ref={(node) => setMeshRef(obj.id, node)}
        />
      ))}

      {selectedMesh && (
        <TransformControls
          object={selectedMesh}
          mode={gizmoMode}
          onMouseUp={() => {
            if (!selected) return;
            // Commit final transform to React state ONLY when the drag finishes
            onUpdate(selected.id, {
              position: { x: selectedMesh.position.x, y: selectedMesh.position.y, z: selectedMesh.position.z },
              rotation: { x: selectedMesh.rotation.x, y: selectedMesh.rotation.y, z: selectedMesh.rotation.z },
              scale: { x: selectedMesh.scale.x, y: selectedMesh.scale.y, z: selectedMesh.scale.z },
            });
          }}
        />
      )}

      <OrbitControls makeDefault enableDamping />
    </Canvas>
  );
}
