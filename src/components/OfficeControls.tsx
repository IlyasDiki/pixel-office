import { useCallback, useEffect, useState } from 'react';
import { EventBus } from '../game/EventBus';
import { supabase } from '../lib/supabase';
import {
  checkIn, checkOut, fetchFreeSeats, fetchMyAttendance, setStatus,
} from '../services/attendanceService';
import type { Status } from '../types';

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'at_desk', label: 'Di meja' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'focus', label: 'Fokus' },
  { value: 'break', label: 'Istirahat' },
];

export default function OfficeControls({ email }: { email: string }) {
  const [me, setMe] = useState<{ status: Status } | null>(null);
  const [freeSeats, setFreeSeats] = useState<{ id: number; label: string }[]>([]);
  const [seatId, setSeatId] = useState<number | ''>('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const mine = await fetchMyAttendance();
      setMe(mine);
      if (!mine) {
        const seats = await fetchFreeSeats();
        setFreeSeats(seats);
        setSeatId(seats[0]?.id ?? '');
      }
    } catch (e) {
      setMsg((e as { message?: string }).message ?? 'Gagal memuat data');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setMsg('');
    try {
      await action();
      EventBus.emit('presence:refresh');
    } catch (e) {
      const err = e as { code?: string; message?: string };
      setMsg(err.code === '23505' ? 'Kursi itu baru saja diambil orang lain.' : err.message ?? 'Terjadi kesalahan');
    }
    await load();
    setBusy(false);
  };

  const box = {
    position: 'fixed' as const, right: 16, top: 16, width: 240, padding: 16,
    borderRadius: 12, background: '#1f2233', color: '#fff', fontFamily: 'sans-serif',
    boxShadow: '0 8px 24px rgba(0,0,0,.4)', display: 'flex', flexDirection: 'column' as const, gap: 8,
  };

  return (
    <div style={box}>
      <div style={{ fontSize: 13, opacity: 0.7 }}>{email}</div>

      {me ? (
        <>
          <label style={{ fontSize: 13 }}>Status saya</label>
          <select value={me.status} disabled={busy}
            onChange={(e) => run(() => setStatus(e.target.value as Status))}>
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button disabled={busy} onClick={() => run(checkOut)}>Pulang</button>
        </>
      ) : (
        <>
          <label style={{ fontSize: 13 }}>Pilih kursi</label>
          <select value={seatId} disabled={busy || freeSeats.length === 0}
            onChange={(e) => setSeatId(Number(e.target.value))}>
            {freeSeats.length === 0 && <option value="">Semua kursi penuh</option>}
            {freeSeats.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <button disabled={busy || seatId === ''} onClick={() => run(() => checkIn(Number(seatId)))}>
            Masuk Kantor
          </button>
        </>
      )}

      <button disabled={busy} onClick={() => supabase.auth.signOut()}>Keluar akun</button>
      {msg && <div style={{ color: '#f87171', fontSize: 13 }}>{msg}</div>}
    </div>
  );
}