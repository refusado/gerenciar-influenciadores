interface InfluencerRowProps {
  influencer: {
    id: number;
    name: string;
    instagram: string;
    neighborhood: string;
    niche: string;
    reach: number;
  };
}

export function InfluencerTableRow({ influencer }: InfluencerRowProps) {
  return (
    <tr className="duration-100 hover:bg-zinc-600/20">
      <td className="whitespace-nowrap px-6 py-4 text-sm">{influencer.id}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">{influencer.name}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <a
          href="http://instagram.com/test"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-200/80 before:content-['@'] hover:underline"
        >
          {influencer.instagram}
        </a>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        {influencer.neighborhood}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        {influencer.niche}
      </td>
      <td className="py- whitespace-nowrap px-6 text-sm">{influencer.reach}</td>
      <td></td>
    </tr>
  );
}
