'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { InfluencerTableActions } from './actions';
import { TableHeader } from './header';
import { InfluencerTableRow } from './row';
import { AllInfluencersResponse, Influencer } from '@/types/influencer';
import influencerApi from '@/app/admin/api/influencerApi';
import { Pagination } from './pagination';

const fetchInfluencers = async (
  page: number,
): Promise<AllInfluencersResponse> => {
  const result = await influencerApi.getAllInfluencers({
    limit: 5,
    page,
  });
  return result;
};

export default function InfluencersTable() {
  const [page, setPage] = useState(1);

  const { data } = useQuery<AllInfluencersResponse>({
    queryKey: ['influencers', page],
    queryFn: () => fetchInfluencers(page),
    placeholderData: keepPreviousData,
  });

  const influencers = data?.influencers || [];
  const hasMore = (data?.totalPages || 1) > page || false;
  const totalInfluencers = data?.totalInfluencers || 0;
  const limit = data?.limit || 5;

  return (
    <section className="mb-4">
      <div className="relative flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full p-1.5 align-middle">
            <div className="overflow-hidden rounded-lg border border-zinc-700/40 bg-indigo-950/5 shadow-md">
              <table className="min-w-full divide-y divide-zinc-700">
                <TableHeader />
                <tbody className="divide-y divide-zinc-800">
                  {influencers.map((influencer: Influencer) => (
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
      <Pagination
        data={{ hasMore, totalInfluencers, limit }}
        page={page}
        setPage={setPage}
      />
    </section>
  );
}
