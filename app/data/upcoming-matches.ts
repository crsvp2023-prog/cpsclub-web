export interface Match {
  id: number;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  matchDate: Date;
}

export const UPCOMING_MATCHES: Match[] = [
  {
    id: 1,
    opponent: 'CPSC vs Old Ignatians (Taronga)',
    date: '10 Jan',
    time: '1:00 PM',
    venue: 'Primrose Oval',
    matchDate: new Date('2026-01-10T13:00:00'),
  },
];