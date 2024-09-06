'use client';

import { useModal } from '@/hooks/useModal';
import { CirclesThreePlus } from '@phosphor-icons/react/dist/ssr';

export function CreateBrandButton() {
  const { openModal } = useModal();

  return (
    <span className="bg-zinc-900">
      <button
        onClick={() => openModal('create-brand')}
        className="flex items-center gap-2.5 rounded-full bg-yellow-500/15 px-3.5 py-1.5 duration-200 hover:bg-yellow-500/20 hover:brightness-105"
      >
        Nova
        <CirclesThreePlus className="size-5" />
      </button>
    </span>
  );
}
