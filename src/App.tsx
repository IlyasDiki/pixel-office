import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';
import StatusPanel from './components/StatusPanel';
import PresenceList from './components/PresenceList';
import LoginPage from './components/LoginPage';
import SetPasswordPage from './components/SetPasswordPage';
import OfficeControls from './components/OfficeControls';
import { useAuth } from './hooks/useAuth';
import { useRealtimePresence } from './hooks/useRealtimePresence';
import type { PresenceEntry } from './types';

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [selected, setSelected] = useState<PresenceEntry | null>(null);
    const [changing, setChanging] = useState(false);
    const { session, loading, recovery, clearRecovery } = useAuth();

    useRealtimePresence(!!session);

    useEffect(() => {
        const onClick = (p: PresenceEntry) => setSelected(p);
        const onUpdated = (list: PresenceEntry[]) =>
            setSelected((prev) =>
                prev ? list.find((x) => x.userId === prev.userId) ?? null : null
            );
        EventBus.on('avatar:clicked', onClick);
        EventBus.on('presence:updated', onUpdated);
        return () => {
            EventBus.off('avatar:clicked', onClick);
            EventBus.off('presence:updated', onUpdated);
        };
    }, []);

    if (loading) return <div style={{ color: '#fff', padding: 24 }}>Memuat...</div>;
    if (!session) return <LoginPage />;

    // Wajib atur password: dari tautan reset, atau login pertama (belum ada penanda)
    const mustSetPassword = recovery || !session.user.user_metadata?.password_set;
    if (mustSetPassword || changing) {
        return (
            <SetPasswordPage
                title={recovery ? 'Buat password baru' : mustSetPassword ? 'Buat password Anda' : 'Ganti password'}
                onDone={() => { clearRecovery(); setChanging(false); }}
                onCancel={mustSetPassword ? undefined : () => setChanging(false)}
            />
        );
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <OfficeControls
                email={session.user.email ?? ''}
                onChangePassword={() => setChanging(true)}
            />
            <StatusPanel entry={selected} onClose={() => setSelected(null)} />
            <PresenceList />
        </div>
    );
}

export default App;