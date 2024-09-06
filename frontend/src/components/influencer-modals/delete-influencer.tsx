import influencerApi from '@/app/admin/api/influencerApi';
import { BASE_URL } from '@/consts';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { formatDate, formatRelativeDate } from '@/lib/format-date';
import { Influencer } from '@/types/influencer';
import {
  CameraPlus,
  CameraSlash,
  Crosshair,
  Eye,
  InstagramLogo,
  MapPin,
  Warning,
} from '@phosphor-icons/react/dist/ssr';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function DeleteInfluencerModal({ resource }: { resource: Influencer }) {
  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();

  const queryClient = useQueryClient();
  const { mutateAsync: deleteInfluencer } = useMutation({
    mutationFn: () => influencerApi.deleteInfluencer(resource.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['influencers'] });
      closeModal();
      addToast(`Influenciador #${resource.id} excluído com sucesso.`);
    },
  });

  return (
    <div className="">
      <div className="mb-4 flex flex-col gap-4 md:flex-row">
        <div className="mx-auto flex aspect-square max-h-[320px] w-full max-w-[320px] flex-col items-center justify-center overflow-hidden rounded-md border-[1px] border-zinc-700/30 bg-zinc-950 shadow-md md:shrink-0">
          {resource.image ? (
            <img
              src={`${BASE_URL}/img/${resource.image}`}
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
        <div className="overflow-auto md:max-w-xl">
          <p className="mb-4">
            <Warning className="inline-block size-4" /> Atenção! Esta operação
            irá excluir permanentemente o influenciador
            {` ${resource.name}`} e todos os seus dados.{' '}
            <strong>Esta operação não pode ser desfeita</strong>.
          </p>
          <div className="mb-4 rounded-lg bg-zinc-900 p-4 shadow-md">
            <h5 className="mb-4 text-lg font-bold">
              {resource.name} - #{resource.id}
            </h5>
            <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
              <a
                href={`http://www.instagram.com/-${resource.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-800/80 px-2.5 py-0.5 hover:bg-purple-800/15"
                title="Perfil no Instagram"
              >
                <InstagramLogo className="inline-block size-4" />{' '}
                {resource.instagram}
              </a>
              <p
                className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-800/80 px-2.5 py-0.5"
                title=" Nicho "
              >
                <Crosshair className="inline-block size-4" /> {resource.niche}
              </p>
              <p
                className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-800/80 px-2.5 py-0.5"
                title="Alcance"
              >
                <Eye className="inline-block size-4" /> {resource.reach}
              </p>
            </div>

            <div className="mb-4">
              <p
                className="flex items-start gap-2 text-zinc-300"
                title={resource.cep}
              >
                <MapPin className="inline-block size-5 flex-shrink-0" />
                {resource.street}, {resource.neighborhood}, {resource.city} -{' '}
                {resource.state}
              </p>
            </div>
          </div>
          <p
            className="text-sm text-yellow-200/40"
            title={formatDate(resource.createdAt)}
          >
            Criado há {formatRelativeDate(resource.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-end gap-3 *:rounded-sm sm:flex-row">
        <button
          onClick={() => deleteInfluencer()}
          className="inline-flex items-center justify-center gap-2 px-6 py-2 text-error hover:bg-red-950/20"
        >
          Excluir permanentemente
        </button>
        <button
          onClick={() => openModal('view-influencer', resource)}
          className="inline-flex items-center justify-center gap-2 bg-purple-600/70 px-4 py-2 duration-200 hover:bg-purple-600/85"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
