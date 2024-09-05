'use client';

import { queryClient } from '@/lib/tanstack-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { CreateInfluencerButton } from './components/create-btn';
import InfluencersTable from './components/table';
import { ModalProvider } from '@/hooks/useModal';

export default function InfluenciadoresPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <div className="relative mx-auto mb-4 flex w-fit items-center gap-4 px-4">
          <h2 className="text-2xl sm:text-3xl">Influenciadores</h2>
          <CreateInfluencerButton />
        </div>
        <InfluencersTable />
      </ModalProvider>
    </QueryClientProvider>
  );
}
