import type { PresenceEntry } from '../types';

export const dummyPresence: PresenceEntry[] = [
  { userId: '1', name: 'Rina',  status: 'at_desk', seatLabel: 'A1', x: 200, y: 220, color: 0xef4444, checkedInAt: '08:05' },
  { userId: '2', name: 'Budi',  status: 'meeting', seatLabel: 'A2', x: 512, y: 220, color: 0x3b82f6, checkedInAt: '08:30' },
  { userId: '3', name: 'Sari',  status: 'focus',   seatLabel: 'A3', x: 824, y: 220, color: 0xa855f7, checkedInAt: '08:12' },
  { userId: '4', name: 'Dimas', status: 'break',   seatLabel: 'B1', x: 300, y: 480, color: 0xf59e0b, checkedInAt: '09:01' },
  { userId: '5', name: 'Ayu',   status: 'at_desk', seatLabel: 'B2', x: 724, y: 480, color: 0x22c55e, checkedInAt: '08:47' },
];