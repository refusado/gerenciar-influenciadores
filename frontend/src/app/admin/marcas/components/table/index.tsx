'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { TableHeader } from './header';
import { BrandTableRow } from './row';
import { Pagination } from './pagination';
import brandApi, { AllBrandsResponse } from '@/app/admin/api/brandApi';
import { BrandTableActions } from './actions';

const fetchInfluencers = async (page: number): Promise<AllBrandsResponse> => {
  const result = await brandApi.getAllBrands({
    limit: 5,
    page,
  });

  return result;
};

export default function InfluencersTable() {
  const [page, setPage] = useState(1);

  const { data } = useQuery<AllBrandsResponse>({
    queryKey: ['brands', page],
    queryFn: () => fetchInfluencers(page),
    placeholderData: keepPreviousData,
  });

  if (!data) return null;

  const brands = data.brands;
  const hasMore = data.totalPages > page;
  const totalBrands = data.totalBrands;
  const limit = data.limit;

  return (
    <section className="mb-4">
      <div className="relative flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full p-1.5 align-middle">
            <div className="overflow-hidden rounded-lg border border-zinc-700/40 bg-indigo-950/5 shadow-md">
              <table className="min-w-full divide-y divide-zinc-700">
                <TableHeader />
                <tbody className="divide-y divide-zinc-800">
                  {brands.map((brand) => (
                    <BrandTableRow key={brand.id} brand={brand} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <BrandTableActions brands={brands} />
      </div>
      <Pagination
        data={{ hasMore, totalBrands, limit }}
        page={page}
        setPage={setPage}
      />
    </section>
  );
}
