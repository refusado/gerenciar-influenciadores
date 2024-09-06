import { useModal } from '@/hooks/useModal';
import { Pencil, Trash } from '@phosphor-icons/react/dist/ssr';
import { BrandResponse } from '@/types/brand';
import { BrandDetails } from './brand-details';

export function ViewBrandModal({ brand }: { brand: BrandResponse }) {
  const { openModal } = useModal();

  return (
    <div className="">
      <div className="mb-4 flex flex-col gap-4 md:flex-row">
        <div className="w-full overflow-auto">
          <BrandDetails brandId={brand.id} />
        </div>
      </div>

      <div className="flex flex-col justify-end gap-3 *:rounded-sm sm:flex-row">
        <button
          onClick={() => openModal('delete-brand', undefined, brand)}
          className="inline-flex items-center justify-center gap-2 px-6 py-2 text-error hover:bg-red-950/20"
        >
          Excluir <Trash className="size-5" />
        </button>
        <button
          onClick={() => openModal('edit-brand', undefined, brand)}
          className="inline-flex items-center justify-center gap-2 bg-amber-500/70 px-4 py-2 duration-200 hover:bg-amber-500/85"
        >
          Editar informações <Pencil className="size-5" />
        </button>
      </div>
    </div>
  );
}
