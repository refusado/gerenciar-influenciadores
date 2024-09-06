import { useModal } from '@/hooks/useModal';
import { Influencer } from '@/types/influencer';
import {
  CameraPlus,
  CameraSlash,
  Pencil,
  Trash,
  Unite,
} from '@phosphor-icons/react/dist/ssr';
import { InfluencerDetails } from './influencer-details';

export function ViewInfluencerModal({ resource }: { resource: Influencer }) {
  const { openModal } = useModal();

  return (
    <div className="">
      <div className="mb-4 flex flex-col gap-4 md:flex-row">
        <div className="mx-auto flex aspect-square max-h-[320px] w-full max-w-[320px] flex-col items-center justify-center overflow-hidden rounded-md border-[1px] border-zinc-700/30 bg-zinc-950 shadow-md md:shrink-0">
          {resource.image ? (
            <img
              src={`http://localhost:3333/img/${resource.image}`}
              alt={`Foto de ${resource.name}`}
              className="size-full object-cover"
            />
          ) : (
            <button
              className="group relative flex size-full flex-col items-center justify-center gap-2 bg-purple-400/5"
              onClick={() => openModal('edit-influencer', resource)}
            >
              <CameraSlash className="size-28 opacity-30" />
              <p className="text-xl opacity-30">Sem foto</p>
              <p className="absolute flex size-full items-center justify-center gap-2 bg-zinc-950 text-xl opacity-0 duration-200 group-hover:opacity-100">
                Adicionar
                <CameraPlus className="size-10 opacity-60" />
              </p>
            </button>
          )}
        </div>
        <div className="w-full max-w-xl overflow-auto">
          <InfluencerDetails influencerId={resource.id} />
        </div>
      </div>

      <div className="flex flex-col justify-end gap-3 *:rounded-sm sm:flex-row">
        <button
          onClick={() => openModal('delete-influencer', resource)}
          className="inline-flex items-center justify-center gap-2 px-6 py-2 text-error hover:bg-red-950/20"
        >
          Excluir <Trash className="size-5" />
        </button>
        <button
          onClick={() => openModal('edit-influencer', resource)}
          className="inline-flex items-center justify-center gap-2 bg-amber-500/70 px-4 py-2 duration-200 hover:bg-amber-500/85"
        >
          Editar informações <Pencil className="size-5" />
        </button>
        <button
          onClick={() => openModal('link-influencer', resource)}
          className="inline-flex items-center justify-center gap-2 bg-purple-600/70 px-4 py-2 duration-200 hover:bg-purple-600/85"
        >
          Associar uma marca <Unite className="size-5" />
        </button>
      </div>
    </div>
  );
}
