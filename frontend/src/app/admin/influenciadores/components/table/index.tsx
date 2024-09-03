import { InfluencerTableActions } from './actions';
import { TableHeader } from './header';
import { InfluencerTableRow } from './row';

export default function InfluencersTable() {
  const influencers = [
    {
      id: 1,
      name: 'João Silva',
      instagram: 'uniqueusername',
      neighborhood: 'Centro',
      niche: 'Fitness',
      reach: 321984,
    },
    {
      id: 2,
      name: 'Carlos Silva',
      instagram: 'otherusername',
      neighborhood: 'Savassi',
      niche: 'Games',
      reach: 7328,
    },
    {
      id: 3,
      name: 'Maria Santos',
      instagram: 'anotherusername',
      neighborhood: 'Buritis',
      niche: 'Music',
      reach: 13278,
    },
    {
      id: 4,
      name: 'Joaquim Souza',
      instagram: 'lastusername',
      neighborhood: 'Savassi',
      niche: 'Books',
      reach: 3328,
    },
  ];

  return (
    <div className="relative flex flex-col">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full p-1.5 align-middle">
          <div className="overflow-hidden rounded-lg border border-zinc-700/40 bg-indigo-950/5 shadow-md">
            <table className="min-w-full divide-y divide-zinc-700">
              <TableHeader />
              <tbody className="divide-y divide-zinc-800">
                {influencers.map((influencer) => (
                  <InfluencerTableRow
                    key={influencer.id}
                    influencer={influencer}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <InfluencerTableActions influencers={influencers} />
    </div>
  );
}
