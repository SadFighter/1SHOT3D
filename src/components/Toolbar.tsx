import type { GizmoMode, PrimitiveKind } from '../types';

interface Props {
  gizmoMode: GizmoMode;
  onGizmoMode: (m: GizmoMode) => void;
  onAdd: (kind: PrimitiveKind) => void;
  onExport: () => void;
}

const btn: React.CSSProperties = {
  padding: '6px 10px',
  background: '#2a2a35',
  color: '#ddd',
  border: '1px solid #3a3a48',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 13,
};

const active: React.CSSProperties = { ...btn, background: '#4a6cf7', borderColor: '#4a6cf7', color: '#fff' };

export function Toolbar({ gizmoMode, onGizmoMode, onAdd, onExport }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: 10, background: '#14141a', borderBottom: '1px solid #2a2a35', flexWrap: 'wrap', alignItems: 'center' }}>
      <strong style={{ color: '#eee', marginRight: 8, letterSpacing: 1 }}>1SHOT3D</strong>

      <span style={{ color: '#666', fontSize: 12 }}>Add:</span>
      {(['box', 'sphere', 'plane', 'cylinder'] as PrimitiveKind[]).map((k) => (
        <button key={k} style={btn} onClick={() => onAdd(k)}>{k}</button>
      ))}

      <span style={{ width: 12 }} />
      <span style={{ color: '#666', fontSize: 12 }}>Gizmo:</span>
      {(['translate', 'rotate', 'scale'] as GizmoMode[]).map((m) => (
        <button key={m} style={gizmoMode === m ? active : btn} onClick={() => onGizmoMode(m)}>{m}</button>
      ))}

      <span style={{ flex: 1 }} />
      <button style={{ ...btn, background: '#2e7d32', borderColor: '#2e7d32', color: '#fff' }} onClick={onExport}>
        Export for Web
      </button>
    </div>
  );
}