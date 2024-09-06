'use client';

import InfluencersTable from './components/table';
import { CreateBrandButton } from './components/create-btn';

export default function MarcasPage() {
  return (
    <>
      <div className="relative mx-auto mb-4 flex w-fit items-center gap-4 px-4">
        <h2 className="text-2xl sm:text-3xl">Marcas</h2>
        <CreateBrandButton />
      </div>
      <InfluencersTable />
    </>
  );
}
