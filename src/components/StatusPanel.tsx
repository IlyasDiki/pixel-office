import type { PresenceEntry, Status } from '../types';

const LABEL: Record<Status, string> = {
  at_desk: 'Di meja',
  meeting: 'Meeting',
  break: 'Istirahat',
  focus: 'Fokus',
  wfh: 'WFH',
};

interface Props {
  entry: PresenceEntry | null;
  onClose: () => void;
}

export default function StatusPanel({ entry, onClose }: Props) {
  if (!entry) return null;
  return (
    <div style={{
      position: 'fixed', right: 16, bottom: 16, width: 240, padding: 16,
      borderRadius: 12, background: '#1f2233', color: '#fff',
      boxShadow: '0 8px 24px rgba(0,0,0,.4)', fontFamily: 'sans-serif',
    }}>
      <strong style={{ fontSize: 18 }}>{entry.name}</strong>
      <div>Status: {LABEL[entry.status]}</div>
      <div>Kursi: {entry.seatLabel}</div>
      <div>Masuk: {entry.checkedInAt}</div>
      <button onClick={onClose} style={{ marginTop: 12 }}>Tutup</button>
    </div>
  );
}