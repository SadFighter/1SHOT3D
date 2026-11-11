import { useCallback, useState } from 'react';
import { Viewport } from './components/Viewport';
import { Toolbar } from './components/Toolbar';
import { Inspector } from './components/Inspector';
import { generateHtml } from './export/generateHtml';
import type { GizmoMode, PrimitiveKind, SceneObject } from './types';

let nextId = 1;
const uid = () => `obj-${nextId++}`;

const DEFAULT_COLOR = '#5b8def';

function makeObject(kind: PrimitiveKind): SceneObject {
  return {
    id: uid(),
    kind,
    position: { x: 0, y: kind === 'plane' ? 0 : 0.5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: DEFAULT_COLOR,
  };
}

export default function App() {
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gizmoMode, setGizmoMode] = useState<GizmoMode>('translate');

  const addObject = useCallback((kind: PrimitiveKind) => {
    const obj = makeObject(kind);
    setObjects((prev) => [...prev, obj]);
    setSelectedId(obj.id);
  }, []);

  const updateObject = useCallback((id: string, patch: Partial<SceneObject>) => {
    setObjects((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }, []);

  const deleteObject = useCallback((id: string) => {
    setObjects((prev) => prev.filter((o) => o.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const handleExport = useCallback(() => {
    const html = generateHtml({
      version: 1,
      camera: { position: { x: 4, y: 3, z: 6 }, target: { x: 0, y: 0, z: 0 } },
      objects,
    });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '1shot3d-scene.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [objects]);

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <Toolbar
        gizmoMode={gizmoMode}
        onGizmoMode={setGizmoMode}
        onAdd={addObject}
        onExport={handleExport}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Viewport
            objects={objects}
            selectedId={selectedId}
            gizmoMode={gizmoMode}
            onSelect={setSelectedId}
            onUpdate={updateObject}
          />
        </div>
        <Inspector
          objects={objects}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdate={updateObject}
          onDelete={deleteObject}
        />
      </div>
    </div>
  );
}