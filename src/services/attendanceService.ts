import { supabase } from '../lib/supabase';
import type { PresenceEntry, Status } from '../types';

export async function fetchPresence(): Promise<PresenceEntry[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('user_id, status, checked_in_at, seats(label, x, y), profiles(full_name, avatar_color)')
    .is('checked_out_at', null);

  if (error) throw error;

  return (data ?? [])
    .filter((row: any) => row.seats) // yang tanpa kursi (WFH) belum ditampilkan di canvas
    .map((row: any) => ({
      userId: row.user_id,
      name: row.profiles.full_name,
      status: row.status as Status,
      seatLabel: row.seats.label,
      x: row.seats.x,
      y: row.seats.y,
      color: parseInt((row.profiles.avatar_color ?? '#4f46e5').replace('#', ''), 16),
      checkedInAt: new Date(row.checked_in_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
}

async function currentUserId() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function fetchMyAttendance() {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data, error } = await supabase
    .from('attendance')
    .select('status, seat_id')
    .eq('user_id', uid)
    .is('checked_out_at', null)
    .maybeSingle();
  if (error) throw error;
  return data as { status: Status; seat_id: number | null } | null;
}

export async function fetchFreeSeats() {
  const [seatsRes, takenRes] = await Promise.all([
    supabase.from('seats').select('id, label').order('id'),
    supabase.from('attendance').select('seat_id').is('checked_out_at', null),
  ]);
  if (seatsRes.error) throw seatsRes.error;
  if (takenRes.error) throw takenRes.error;
  const taken = new Set((takenRes.data ?? []).map((r) => r.seat_id));
  return (seatsRes.data ?? []).filter((s) => !taken.has(s.id));
}

export async function checkIn(seatId: number) {
  const uid = await currentUserId();
  if (!uid) throw new Error('Belum login');
  const { error } = await supabase
    .from('attendance')
    .insert({ user_id: uid, seat_id: seatId, status: 'at_desk' });
  if (error) throw error;
}

export async function checkOut() {
  const uid = await currentUserId();
  if (!uid) throw new Error('Belum login');
  const { error } = await supabase
    .from('attendance')
    .update({ checked_out_at: new Date().toISOString() })
    .eq('user_id', uid)
    .is('checked_out_at', null);
  if (error) throw error;
}

export async function setStatus(status: Status) {
  const uid = await currentUserId();
  if (!uid) throw new Error('Belum login');
  const { error } = await supabase
    .from('attendance')
    .update({ status })
    .eq('user_id', uid)
    .is('checked_out_at', null);
  if (error) throw error;
}