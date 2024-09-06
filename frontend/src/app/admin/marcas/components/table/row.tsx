import { formatDateTime, formatRelativeDate } from '@/lib/format-date';
import { BrandResponse } from '@/types/brand';

export function BrandTableRow({ brand }: { brand: BrandResponse }) {
  const { id, name, description, niche, createdAt } = brand;

  return (
    <tr className="duration-100 hover:bg-zinc-600/20">
      <td className="whitespace-nowrap px-6 py-4 text-sm">{id}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{name}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{niche}</td>
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
