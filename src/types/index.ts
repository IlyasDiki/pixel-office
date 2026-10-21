export type Status = 'at_desk' | 'meeting' | 'break' | 'focus' | 'wfh';

export interface PresenceEntry {
  userId: string;
  name: string;
  status: Status;
  seatLabel: string;
  x: number;
  y: number;
  color: number; // warna baju, format 0xRRGGBB
  checkedInAt: string;
}