'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from './toast';

export function Navigate() {
  const router = useRouter();
  const params = useSearchParams();
  const { addToast } = useToast();

  useEffect(() => {
    const path = params.get('redirect');
    if (path) return router.push(path);

    const message = params.get('message');
    if (message) {
      switch (message) {
        case 'unauthorized':
          addToast('Acesso negado. Por favor, realize o login.');
          break;
        case 'logout':
          addToast('Sessão encerrada.');
          break;
      }
    }
  }, [params, router]);

  return <></>;
}
