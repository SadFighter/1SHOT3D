import type { SceneObject } from '../types';

interface Props {
  objects: SceneObject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<SceneObject>) => void;
  onDelete: (id: string) => void;
}

export function Inspector({ objects, selectedId, onSelect, onUpdate, onDelete }: Props) {
  const selected = objects.find((o) => o.id === selectedId) ?? null;

  return (
    <aside style={{ width: 260, background: '#16161c', borderLeft: '1px solid #2a2a35', color: '#ddd', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 12, borderBottom: '1px solid #2a2a35', fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>
        Objects ({objects.length})
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {objects.length === 0 && <div style={{ padding: 12, color: '#555', fontSize: 13 }}>No objects yet. Add one from the toolbar.</div>}
        {objects.map((o) => (
          <div
            key={o.id}
            onClick={() => onSelect(o.id)}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              background: o.id === selectedId ? '#2a2a3a' : 'transparent',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13,
            }}
          >
            <span>{o.kind} <span style={{ color: '#666' }}>{o.id}</span></span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(o.id); }}
              style={{ background: 'transparent', border: 'none', color: '#c66', cursor: 'pointer', fontSize: 14 }}
              title="Delete"
            >✕</button>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ padding: 12, borderTop: '1px solid #2a2a35' }}>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>Selected</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            Color
            <input
              type="color"
              value={selected.color}
              onChange={(e) => onUpdate(selected.id, { color: e.target.value })}
              style={{ width: 40, height: 26, border: 'none', background: 'transparent', cursor: 'pointer' }}
            />
          </label>
        </div>
      )}
    </aside>
  );
}