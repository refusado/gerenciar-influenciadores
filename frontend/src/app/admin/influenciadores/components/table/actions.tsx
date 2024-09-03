'use client';

import { useModal } from '@/hooks/useModal';
import {
  CaretDown,
  Eye,
  Pencil,
  Trash,
  Unite,
  Clipboard,
} from '@phosphor-icons/react/dist/ssr';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type ActionsProps = {
  influencers: {
    id: number;
    name: string;
    instagram: string;
    neighborhood: string;
    niche: string;
    reach: number;
  }[];
};

export function InfluencerTableActions({ influencers }: ActionsProps) {
  const { openModal } = useModal();

  return (
    <div className="absolute right-0 -mr-1.5 inline-block p-1.5 align-middle">
      <div className="w-fit overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
        <table className="w-fit divide-y divide-zinc-700 bg-zinc-700/30">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-center text-xs font-bold uppercase"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-600/60">
            {influencers.map((influencer) => (
              <tr key={influencer.id} className="duration-100">
                <td className="whitespace-nowrap p-0 text-center text-sm">
                  <button
                    onClick={() => openModal('view-influencer', influencer.id)}
                    className="group px-5 py-4 ring-inset hover:bg-zinc-950/15 active:bg-zinc-950/40"
                    title="Ver detalhes"
                  >
                    <Eye className="size-5 group-hover:text-purple-200" />
                  </button>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="group px-5 py-4 ring-inset hover:bg-zinc-950/35 data-[state=open]:bg-zinc-950/55">
                      <CaretDown className="size-5 group-hover:text-purple-200" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="rounded-md bg-zinc-950 text-start text-sm text-zinc-200/90 shadow-sm *:flex *:cursor-pointer *:items-center *:gap-2">
                      <DropdownMenu.Item className="px-4 py-2.5 hover:bg-zinc-500/5">
                        <Clipboard className="size-4" weight="light" /> Copiar
                        nome
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() =>
                          openModal('edit-influencer', influencer.id)
                        }
                        className="px-4 py-2.5 hover:bg-zinc-500/5"
                      >
                        <Pencil className="size-4" weight="light" /> Editar
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() =>
                          openModal('link-influencer', influencer.id)
                        }
                        className="px-4 py-2.5 hover:bg-zinc-500/5"
                      >
                        <Unite className="size-4" weight="light" /> Associar
                        marca
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() =>
                          openModal('delete-influencer', influencer.id)
                        }
                        className="px-4 py-2.5 text-error/80 hover:bg-red-500/5"
                      >
                        <Trash className="size-4" weight="light" /> Excluir
                      </DropdownMenu.Item>
                      <span>
                        <DropdownMenu.Arrow className="h-3 w-4" />
                      </span>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
