import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';

interface Props {
  title: string;
  onDone: () => void;
  onCancel?: () => void; // kosong = wajib, hanya bisa keluar akun
}

export default function SetPasswordPage({ title, onDone, onCancel }: Props) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (pw.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (pw !== pw2) {
      setError('Konfirmasi password tidak sama.');
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({
      password: pw,
      data: { password_set: true },
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    onDone();
  };

  const input = {
    padding: 10, fontSize: 16, borderRadius: 8, border: '1px solid #444',
    background: '#2f3349', color: '#fff',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: 12, width: 300, padding: 24,
        borderRadius: 12, background: '#1f2233', color: '#fff',
      }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <input style={input} type="password" placeholder="Password baru (min. 8 karakter)"
          value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" required />
        <input style={input} type="password" placeholder="Ulangi password baru"
          value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" required />
        <button type="submit" disabled={busy} style={{ padding: 10, cursor: 'pointer' }}>
          {busy ? 'Menyimpan...' : 'Simpan password'}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} style={{ padding: 10, cursor: 'pointer' }}>Batal</button>
        ) : (
          <button type="button" onClick={() => supabase.auth.signOut()} style={{ padding: 10, cursor: 'pointer' }}>
            Keluar akun
          </button>
        )}
        {error && <div style={{ color: '#f87171', fontSize: 14 }}>{error}</div>}
      </form>
    </div>
  );
}