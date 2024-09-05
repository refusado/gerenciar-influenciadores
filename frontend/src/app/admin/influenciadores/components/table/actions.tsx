'use client';

import { useToast } from '@/hooks/useToast';
import { useModal } from '@/hooks/useModal';
import { Influencer } from '@/types/influencer';
import {
  Eye,
  Pencil,
  Trash,
  Unite,
  Clipboard,
  List,
} from '@phosphor-icons/react/dist/ssr';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import dayjs from 'dayjs';

export function InfluencerTableActions({
  influencers,
}: {
  influencers: Influencer[];
}) {
  const { openModal } = useModal();
  const { addToast } = useToast();

  function copyInfluencerData(influencer: Influencer) {
    const { id, name, instagram, neighborhood, cep, niche, reach, createdAt } =
      influencer;

    navigator.clipboard.writeText(
      `
      ID: ${id}
      Nome: ${name}
      Instagram: @${instagram}
      Bairro: ${neighborhood}
      CEP: ${cep}
      Nicho: ${niche}
      Alcance: ${reach}
      Criado em: ${dayjs(createdAt).format('DD/MM/YYYY HH:mm')}
      `.replace(/^\s*/gm, ''),
    );
    addToast(
      `Informações do influenciador #${id} copiadas para a área de transferência`,
    );
  }

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
          <tbody className="divide-y divide-zinc-700/40">
            {influencers.map((influencer) => (
              <tr key={influencer.id} className="duration-100">
                <td className="divide-x-2 divide-zinc-600/10 whitespace-nowrap p-0 text-center text-sm">
                  <button
                    onClick={() => openModal('view-influencer', influencer)}
                    className="group px-5 py-4 ring-inset hover:bg-zinc-950/15 active:bg-zinc-950/40"
                    title="Ver detalhes"
                  >
                    <Eye className="size-5 group-hover:text-purple-200" />
                  </button>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="group px-5 py-4 ring-inset hover:bg-zinc-950/35 data-[state=open]:bg-zinc-950/55">
                      <List className="size-5 group-hover:text-purple-200" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="rounded-md bg-zinc-950 text-start text-sm text-zinc-200/90 shadow-sm *:flex *:cursor-pointer *:items-center *:gap-2 *:bg-purple-700/5">
                      <DropdownMenu.Item
                        onClick={() => copyInfluencerData(influencer)}
                        className="px-4 py-2.5 hover:bg-purple-300/5"
                      >
                        <Clipboard className="size-4" weight="light" /> Copiar
                        dados
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => openModal('edit-influencer', influencer)}
                        className="px-4 py-2.5 hover:bg-purple-300/5"
                      >
                        <Pencil className="size-4" weight="light" /> Atualizar
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => openModal('link-influencer', influencer)}
                        className="px-4 py-2.5 hover:bg-purple-300/5"
                      >
                        <Unite className="size-4" weight="light" /> Associar
                        marca
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() =>
                          openModal('delete-influencer', influencer)
                        }
                        className="px-4 py-2.5 text-error/80 hover:bg-red-700/5"
                      >
                        <Trash className="size-4" weight="light" /> Excluir
                      </DropdownMenu.Item>
                      <DropdownMenu.Arrow className="h-3 w-4" />
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
