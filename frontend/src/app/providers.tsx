'use client';

import { ModalProvider } from '@/hooks/useModal';
import { ToastProvider } from '@/hooks/useToast';
import { queryClient } from '@/lib/tanstack-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>{children}</ModalProvider>
        </QueryClientProvider>
      </ToastProvider>
    </>
  );
}
