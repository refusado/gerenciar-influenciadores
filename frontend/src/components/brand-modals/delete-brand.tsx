import brandApi from '@/app/admin/api/brandApi';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { formatDate, formatRelativeDate } from '@/lib/format-date';
import { BrandResponse } from '@/types/brand';
import { Crosshair, Warning } from '@phosphor-icons/react/dist/ssr';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function DeleteBrandModal({ brand }: { brand: BrandResponse }) {
  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();

  const queryClient = useQueryClient();
  const { mutateAsync: deleteBrand } = useMutation({
    mutationFn: () => brandApi.deleteBrand(brand.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      closeModal();
      addToast(`Marca #${brand.id} excluído com sucesso.`);
    },
  });

  return (
    <div className="">
      <div className="mb-4 flex flex-col gap-4 md:flex-row">
        <div className="overflow-auto">
          <p className="mb-4">
            <Warning className="inline-block size-4" /> Atenção! Esta operação
            irá excluir permanentemente a marca
            {` ${brand.name}`} e todos os seus dados.{' '}
            <strong>Esta operação não pode ser desfeita</strong>.
          </p>
          <div className="mb-4 rounded-lg bg-zinc-900 p-4 shadow-md">
            <h5 className="mb-4 text-lg font-bold">
              {brand.name} - #{brand.id}
            </h5>
            <p className="mb-3 text-sm">
              {brand.description ? brand.description : 'Sem descrição'}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <p
                className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-800/80 px-2.5 py-0.5"
                title=" Nicho "
              >
                <Crosshair className="inline-block size-4" /> {brand.niche}
              </p>
            </div>
          </div>
          <p
            className="text-sm text-yellow-200/40"
            title={formatDate(brand.createdAt)}
          >
            Criada há {formatRelativeDate(brand.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-end gap-3 *:rounded-sm sm:flex-row">
        <button
          onClick={() => deleteBrand()}
          className="inline-flex items-center justify-center gap-2 px-6 py-2 text-error hover:bg-red-950/20"
        >
          Excluir permanentemente
        </button>
        <button
          onClick={() => openModal('view-brand', undefined, brand)}
          className="inline-flex items-center justify-center gap-2 bg-purple-600/70 px-4 py-2 duration-200 hover:bg-purple-600/85"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
