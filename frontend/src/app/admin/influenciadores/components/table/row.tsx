import { formatDateTime, formatRelativeDate } from '@/lib/format-date';
import { Influencer } from '@/types/influencer';
import dayjs from 'dayjs';

export function InfluencerTableRow({ influencer }: { influencer: Influencer }) {
  const { id, name, instagram, neighborhood, niche, reach, createdAt } =
    influencer;

  return (
    <tr className="duration-100 hover:bg-zinc-600/20">
      <td className="whitespace-nowrap px-6 py-4 text-sm">{id}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{name}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <a
          href={`http://instagram.com/app_test_${instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-200/80 before:content-['@'] hover:underline"
        >
          {instagram}
        </a>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{neighborhood}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{niche}</td>
      <td className="py- whitespace-nowrap px-6 text-sm">{reach}</td>
      <td
        className="py- cursor-default whitespace-nowrap px-6 text-sm"
        title={formatDateTime(createdAt)}
      >
        {formatRelativeDate(createdAt) === 'agora' ? '' : 'há'}{' '}
        {formatRelativeDate(createdAt)}
      </td>
      <td></td>
    </tr>
  );
}
