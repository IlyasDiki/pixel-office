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
<div className="panel panel-status">
      <strong style={{ fontSize: 18 }}>{entry.name}</strong>
      <div>Status: {LABEL[entry.status]}</div>
      <div>Kursi: {entry.seatLabel}</div>
      <div>Masuk: {entry.checkedInAt}</div>
      <button onClick={onClose} style={{ marginTop: 12 }}>Tutup</button>
    </div>
  );
}