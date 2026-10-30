import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  };

  const input = { padding: 10, borderRadius: 8, border: '1px solid #444', background: '#2f3349', color: '#fff' };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: 12, width: 300, padding: 24,
        borderRadius: 12, background: '#1f2233', color: '#fff',
      }}>
        <h2 style={{ margin: 0 }}>Pixel Office</h2>
        <input style={input} type="email" placeholder="Email kantor" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input style={input} type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={busy} style={{ padding: 10, cursor: 'pointer' }}>
          {busy ? 'Memproses...' : 'Masuk'}
        </button>
        {error && <div style={{ color: '#f87171', fontSize: 14 }}>{error}</div>}
      </form>
    </div>
  );
}