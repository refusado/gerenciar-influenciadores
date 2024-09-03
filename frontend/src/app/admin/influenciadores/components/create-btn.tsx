'use client';

import { useModal } from '@/hooks/useModal';
import { UserPlus } from '@phosphor-icons/react/dist/ssr';

export function CreateInfluencerButton() {
  const { openModal } = useModal();

  return (
    <span className="bg-zinc-900">
      <button
        onClick={() => openModal('create-influencer')}
        className="flex items-center gap-2.5 rounded-full bg-amber-500/15 px-3.5 py-1.5 duration-200 hover:bg-yellow-500/20 hover:brightness-105"
      >
        Novo
        <UserPlus className="size-5" />
      </button>
    </span>
  );
}
