import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');

    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
    } else {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (err) {
        setError(
          /not authorized|rate limit/i.test(err.message)
            ? 'Email reset belum bisa dikirim. Hubungi admin untuk mengatur ulang password.'
            : err.message
        );
      } else {
        setInfo('Jika email terdaftar, tautan untuk membuat password baru sudah dikirim. Cek juga folder spam.');
      }
    }
    setBusy(false);
  };

  const input = {
    padding: 10, fontSize: 16, borderRadius: 8, border: '1px solid #444',
    background: '#2f3349', color: '#fff',
  };
  const linkBtn = {
    background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer',
    textDecoration: 'underline', fontSize: 14, padding: 0,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: 12, width: 300, padding: 24,
        borderRadius: 12, background: '#1f2233', color: '#fff',
      }}>
        <h2 style={{ margin: 0 }}>{mode === 'login' ? 'Pixel Office' : 'Lupa password'}</h2>
        <input style={input} type="email" placeholder="Email kantor" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        {mode === 'login' && (
          <input style={input} type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        )}
        <button type="submit" disabled={busy} style={{ padding: 10, cursor: 'pointer' }}>
          {busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Kirim tautan'}
        </button>
        <button type="button" style={linkBtn}
          onClick={() => { setMode(mode === 'login' ? 'reset' : 'login'); setError(''); setInfo(''); }}>
          {mode === 'login' ? 'Lupa password?' : 'Kembali ke halaman masuk'}
        </button>
        {error && <div style={{ color: '#f87171', fontSize: 14 }}>{error}</div>}
        {info && <div style={{ color: '#86efac', fontSize: 14 }}>{info}</div>}
      </form>
    </div>
  );
}