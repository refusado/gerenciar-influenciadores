'use client';

import { useToast } from '@/components/toast';
import { SignOut } from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';

export function LogoutBtn() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const logout = async () => {
    setLoading(true);
    try {
      window.location.href = '/api/logout';
    } catch (error) {
      addToast('Erro ao encerrar sessão');
    }
    setLoading(false);
  };

  return (
    <button
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm text-error/80 duration-100 hover:text-error disabled:pointer-events-none disabled:opacity-70"
      onClick={logout}
    >
      Encerrar sessão <SignOut className="size-5" />
    </button>
  );
}
