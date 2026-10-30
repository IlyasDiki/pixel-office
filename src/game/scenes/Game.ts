import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { fetchPresence } from '../../services/attendanceService';
import type { PresenceEntry, Status } from '../../types';

const STATUS_COLOR: Record<Status, number> = {
  at_desk: 0x22c55e,
  meeting: 0xf59e0b,
  break: 0x3b82f6,
  focus: 0xa855f7,
  wfh: 0x9ca3af,
};

export class Game extends Scene {
  private avatars = new Map<string, GameObjects.Container>();
  private alive = true;

  constructor() {
    super('Game');
  }

  create() {
    this.alive = true;
    this.drawRoom();
    this.refresh();

    EventBus.on('presence:refresh', this.refresh);
    const cleanup = () => {
      this.alive = false;
      EventBus.off('presence:refresh', this.refresh);
    };
    this.events.once('shutdown', cleanup);
    this.events.once('destroy', cleanup);

    EventBus.emit('current-scene-ready', this);
  }

  private refresh = async () => {
    try {
      const list = await fetchPresence();
      if (!this.alive) return;
      this.avatars.forEach((c) => c.destroy());
      this.avatars.clear();
      list.forEach((p) => this.spawnAvatar(p));
    } catch (err) {
      console.error('Gagal ambil data presence:', err);
    }
  };

  private drawRoom() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x2f3349);
    this.add.rectangle(width / 2, 40, width, 80, 0x1f2233);
    this.add.text(24, 28, 'Kantor Utama', {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffffff',
    });
  }

  private spawnAvatar(p: PresenceEntry) {
    const c = this.add.container(p.x, p.y);
    const style = { fontFamily: 'monospace', fontSize: '16px', color: '#ffffff' };

    const desk = this.add.rectangle(0, 50, 150, 56, 0x8b5e3c).setStrokeStyle(2, 0x5b3a22);
    const seat = this.add.text(0, 50, p.seatLabel, style).setOrigin(0.5);
    const body = this.add.rectangle(0, 0, 36, 44, p.color);
    const head = this.add.circle(0, -34, 14, 0xffd7b0);
    const dot = this.add.circle(22, -52, 6, STATUS_COLOR[p.status]).setStrokeStyle(2, 0x000000);
    const name = this.add.text(0, -72, p.name, style).setOrigin(0.5);

    c.add([desk, seat, body, head, dot, name]);

    body.setInteractive({ useHandCursor: true });
    body.on('pointerover', () => body.setScale(1.1));
    body.on('pointerout', () => body.setScale(1));
    body.on('pointerdown', () => EventBus.emit('avatar:clicked', p));

    this.avatars.set(p.userId, c);
  }
}