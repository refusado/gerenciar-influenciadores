import { api } from '@/app/admin/api/axios';
import brandApi from '@/app/admin/api/brandApi';
import influencerApi from '@/app/admin/api/influencerApi';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { Influencer } from '@/types/influencer';
import {
  CameraPlus,
  CameraSlash,
  Crosshair,
  Eye,
  InstagramLogo,
} from '@phosphor-icons/react/dist/ssr';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function LinkBrand({ resource }: { resource: Influencer }) {
  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { mutateAsync: linkBrand } = useMutation({
    mutationFn: (brandId: number) =>
      influencerApi.linkBrandToInfluencer(resource.id, brandId),
    onSuccess: (_, brandId) => {
      queryClient.invalidateQueries({ queryKey: ['influencers'] });
      closeModal();
      addToast(`Influenciador #${resource.id} associado à marca #${brandId}.`);
      openModal('view-influencer', resource);
    },
    onError() {
      closeModal();
      addToast(`Não foi possível criar associação.`);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () =>
      brandApi.getAllBrands({
        page: 1,
        limit: 100,
      }),
  });

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
        <div className="w-full overflow-auto md:max-w-xl">
          <div className="mb-4 w-full rounded-lg bg-zinc-900 p-4 shadow-md">
            <h4 className="mb-2 text-2xl font-bold">{resource.name}</h4>
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
            <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
              <h5 className="text-lg font-bold">Associar marca</h5>
              {isLoading || !data?.brands ? (
                <p>Carregando marcas...</p>
              ) : (
                <select
                  className="font-lg mb-1 inline-block w-full cursor-pointer appearance-none px-3 py-2 leading-normal hover:brightness-125"
                  value={selectedBrand || ''}
                  onChange={(e) => setSelectedBrand(Number(e.target.value))}
                >
                  <option defaultChecked value="">
                    Selecione uma opção
                  </option>
                  {data?.brands.map((brand: { id: number; name: string }) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-end gap-3 sm:flex-row">
        <button
          onClick={() => {
            setSelectedBrand(null);
            openModal('view-influencer', resource);
          }}
          className="inline-flex items-center justify-center gap-2 px-6 py-2 text-error hover:bg-red-950/20"
        >
          Cancelar
        </button>
        <button
          disabled={!selectedBrand}
          onClick={() => {
            if (selectedBrand) {
              linkBrand(selectedBrand);
            }
          }}
          className="inline-flex items-center justify-center gap-2 bg-purple-600/70 px-4 py-2 duration-200 hover:bg-purple-600/85 disabled:opacity-60"
        >
          Criar associação
        </button>
      </div>
    </div>
  );
}
