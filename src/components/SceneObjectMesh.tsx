import { useRef, useEffect, forwardRef } from 'react';
import * as THREE from 'three';
import type { PrimitiveKind, SceneObject } from '../types';

interface Props {
  obj: SceneObject;
  selected: boolean;
  onSelect: () => void;
}

function Geometry({ kind }: { kind: PrimitiveKind }) {
  switch (kind) {
    case 'box':      return <boxGeometry args={[1, 1, 1]} />;
    case 'sphere':   return <sphereGeometry args={[0.6, 32, 16]} />;
    case 'plane':    return <planeGeometry args={[2, 2]} />;
    case 'cylinder': return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
  }
}

export const SceneObjectMesh = forwardRef<THREE.Mesh, Props>(
  ({ obj, selected, onSelect }, forwardedRef) => {
    const localRef = useRef<THREE.Mesh>(null);

    // Merge our local ref with the forwarded ref from Viewport
    useEffect(() => {
      if (typeof forwardedRef === 'function') {
        forwardedRef(localRef.current);
      } else if (forwardedRef) {
        forwardedRef.current = localRef.current;
      }
    }, [forwardedRef]);

    // Sync React state to the 3D mesh (e.g. when loaded or changed via Inspector)
    useEffect(() => {
      const mesh = localRef.current;
      if (!mesh) return;
      mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
      mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
      mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
    }, [obj.position, obj.rotation, obj.scale]);

    return (
      <mesh
        ref={localRef}
        name={obj.id}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
      >
        <Geometry kind={obj.kind} />
        <meshStandardMaterial
          color={obj.color}
          emissive={selected ? '#3355aa' : '#000000'}
          emissiveIntensity={selected ? 0.4 : 0}
          side={obj.kind === 'plane' ? THREE.DoubleSide : THREE.FrontSide}
        />
      </mesh>
    );
  }
);
