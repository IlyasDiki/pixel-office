import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';
import StatusPanel from './components/StatusPanel';
import LoginPage from './components/LoginPage';
import OfficeControls from './components/OfficeControls';
import { useAuth } from './hooks/useAuth';
import type { PresenceEntry } from './types';

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [selected, setSelected] = useState<PresenceEntry | null>(null);
    const { session, loading } = useAuth();

    useEffect(() => {
        const onClick = (p: PresenceEntry) => setSelected(p);
        EventBus.on('avatar:clicked', onClick);
        return () => {
            EventBus.off('avatar:clicked', onClick);
        };
    }, []);

    if (loading) return <div style={{ color: '#fff', padding: 24 }}>Memuat...</div>;
    if (!session) return <LoginPage />;

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <OfficeControls email={session.user.email ?? ''} />
            <StatusPanel entry={selected} onClose={() => setSelected(null)} />
        </div>
    );
}

export default App;