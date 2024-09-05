import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatRelativeDate(isoDate: string | Date): string {
  const now = dayjs();
  const inputDate = dayjs(isoDate);

  interface Unit {
    unit: 'year' | 'month' | 'day' | 'hour' | 'minute';
    threshold: number;
    translation: [string, string?];
  }

  const units: Unit[] = [
    { unit: 'year', threshold: 1, translation: ['ano'] },
    { unit: 'month', threshold: 1, translation: ['mês', 'meses'] },
    { unit: 'day', threshold: 1, translation: ['dia'] },
    { unit: 'hour', threshold: 1, translation: ['hora'] },
    { unit: 'minute', threshold: 1, translation: ['minuto'] },
  ];

  for (const { unit, threshold, translation: pt } of units) {
    const diff = now.diff(inputDate, unit);
    if (diff >= threshold) {
      return `${diff} ${diff === 1 ? pt : `${pt}s`}`;
    }
  }

  return 'agora';
}

export function formatDate(isoDate: string | Date): string {
  return dayjs(isoDate).format('DD/MM/YYYY');
}

export function formatDateTime(isoDate: string | Date): string {
  return dayjs(isoDate).format('DD/MM/YYYY HH:mm');
}

export function formatTime(isoDate: string | Date): string {
  return dayjs(isoDate).format('HH:mm');
}
