import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { dummyPresence } from '../../data/dummypresence';
import type { PresenceEntry, Status } from '../../types';

const STATUS_COLOR: Record<Status, number> = {
  at_desk: 0x22c55e,
  meeting: 0xf59e0b,
  break: 0x3b82f6,
  focus: 0xa855f7,
  wfh: 0x9ca3af,
};

export class Game extends Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.drawRoom();
    dummyPresence.forEach((p) => this.spawnAvatar(p));
    EventBus.emit('current-scene-ready', this);
  }

  private drawRoom() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x2f3349); // lantai
    this.add.rectangle(width / 2, 40, width, 80, 0x1f2233);             // dinding
    this.add.text(24, 28, 'Kantor Utama', {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffffff',
    });
  }

  private spawnAvatar(p: PresenceEntry) {
    // meja + label kursi
    this.add.rectangle(p.x, p.y + 50, 150, 56, 0x8b5e3c).setStrokeStyle(2, 0x5b3a22);
    this.add.text(p.x, p.y + 50, p.seatLabel, {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffffff',
    }).setOrigin(0.5);

    // badan + kepala
    const body = this.add.rectangle(p.x, p.y, 36, 44, p.color);
    this.add.circle(p.x, p.y - 34, 14, 0xffd7b0);

    // titik status + nama
    this.add.circle(p.x + 22, p.y - 52, 6, STATUS_COLOR[p.status]).setStrokeStyle(2, 0x000000);
    this.add.text(p.x, p.y - 72, p.name, {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffffff',
    }).setOrigin(0.5);

    // interaksi
    body.setInteractive({ useHandCursor: true });
    body.on('pointerover', () => body.setScale(1.1));
    body.on('pointerout', () => body.setScale(1));
    body.on('pointerdown', () => EventBus.emit('avatar:clicked', p));
  }
}