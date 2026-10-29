import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import * as Phaser from 'phaser';
import { EventBus } from './game/EventBus';
import StatusPanel from './components/StatusPanel';
import type { PresenceEntry } from './types';

function App()
{

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const addSprite = () => {

        if (phaserRef.current)
        {
            const scene = phaserRef.current.scene;

            if (scene)
            {
                // Add a new sprite to the current scene at a random position
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);
    
                //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
                const star = scene.add.sprite(x, y, 'star');
    
            }
        }
    }

    const [selected, setSelected] = useState<PresenceEntry | null>(null);

        useEffect(() => {
        const onClick = (p: PresenceEntry) => setSelected(p);
        EventBus.on('avatar:clicked', onClick);
        return () => {
            EventBus.off('avatar:clicked', onClick);
        };
        }, []);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <StatusPanel entry={selected} onClose={() => setSelected(null)} />
            <div>
                <div>
                    <button className="button" onClick={addSprite}>Add New Sprite</button>
                </div>
            </div>
        </div>
    )
}

export default App
