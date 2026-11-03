import { useEffect, useState } from 'react';
import { EventBus } from '../game/EventBus';
import type { PresenceEntry, Status } from '../types';

const LABEL: Record<Status, string> = {
  at_desk: 'Di meja', meeting: 'Meeting', break: 'Istirahat', focus: 'Fokus', wfh: 'WFH',
};
const DOT: Record<Status, string> = {
  at_desk: '#22c55e', meeting: '#f59e0b', break: '#3b82f6', focus: '#a855f7', wfh: '#9ca3af',
};

export default function PresenceList() {
  const [list, setList] = useState<PresenceEntry[]>([]);
  const [open, setOpen] = useState(window.innerWidth < 800);

  useEffect(() => {
    const onUpdated = (l: PresenceEntry[]) => setList(l);
    EventBus.on('presence:updated', onUpdated);
    return () => {
      EventBus.off('presence:updated', onUpdated);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', left: 16, bottom: 16, width: 220, maxHeight: '40vh', overflow: 'auto',
      padding: 12, borderRadius: 12, background: '#1f2233', color: '#fff', fontFamily: 'sans-serif',
      boxShadow: '0 8px 24px rgba(0,0,0,.4)', zIndex: 10,
    }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%' }}>
        Di kantor ({list.length}) {open ? '▾' : '▸'}
      </button>
      {open && (
        <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, fontSize: 14 }}>
          {list.length === 0 && <li style={{ opacity: 0.6 }}>Belum ada yang masuk</li>}
          {list.map((p) => (
            <li key={p.userId} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: DOT[p.status] }} />
              <span style={{ flex: 1 }}>{p.name}</span>
              <span style={{ opacity: 0.7 }}>{LABEL[p.status]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}