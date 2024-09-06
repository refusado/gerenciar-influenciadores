import brandApi from '@/app/admin/api/brandApi';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import {
  formatDate,
  formatDateTime,
  formatRelativeDate,
} from '@/lib/format-date';
import { UniqueBrandResponse } from '@/types/brand';
import {
  Clipboard,
  Crosshair,
  Eye,
  InstagramLogo,
  User,
} from '@phosphor-icons/react/dist/ssr';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

export function BrandDetails({ brandId }: { brandId: number }) {
  const { openModal } = useModal();
  const { data } = useQuery<UniqueBrandResponse>({
    queryKey: ['brand'],
    queryFn: () => brandApi.getBrandById(brandId),
  });
  const { addToast } = useToast();

  if (!data) return <p>Carregando...</p>;

  const { id, name, niche, description, createdAt, influencers, updatedAt } =
    data;

  function copyInfluencerData() {
    navigator.clipboard.writeText(
      `
      ID: ${id}
      Nome: ${name}
      Descrição: ${description}
      Nicho: ${niche}
      Criada em: ${dayjs(createdAt).format('DD/MM/YYYY HH:mm')}
      `.replace(/^\s*/gm, ''),
    );
    addToast(
      `Informações da marca #${id} copiadas para a área de transferência`,
    );
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative mb-4 rounded-lg bg-zinc-900 p-4 shadow-md">
        <h4 className="mb-2 text-2xl font-bold">{name}</h4>

        <button
          onClick={copyInfluencerData}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-zinc-700/50 text-zinc-300 opacity-50 hover:opacity-100"
          title="Copiar dados do influenciador"
        >
          <Clipboard className="size-5" />
        </button>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <p
            className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-800/80 px-2.5 py-0.5"
            title=" Nicho "
          >
            <Crosshair className="inline-block size-4" /> {niche}
          </p>
        </div>

        <p className="mb-6 text-sm">{description}</p>

        <hr className="mb-6 border-zinc-700/50" />

        <div>
          {influencers.length ? (
            <>
              <h4 className="mb-2 text-lg font-semibold">
                <User className="mr-2 inline-block size-5" />
                Influenciadores associados
              </h4>
              <div className="flex flex-col gap-2">
                {influencers.map((influencer, index) => (
                  <button
                    onClick={() => openModal('view-influencer', influencer)}
                    key={index}
                    className="group rounded border border-purple-100/10 bg-purple-200/5 p-2 text-start text-sm shadow-sm duration-200 hover:bg-purple-300/5"
                    title="Visualizar detalhes do influenciador"
                  >
                    <h3 className="flex text-base font-semibold group-hover:underline">
                      {influencer.name}{' '}
                      <span className="ml-auto inline-block opacity-35">
                        #{influencer.id}
                      </span>
                    </h3>
                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
                      <a
                        href={`http://www.instagram.com/-${influencer.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-900/80 px-2.5 py-0.5 hover:bg-purple-800/15"
                        title="Perfil no Instagram"
                      >
                        <InstagramLogo className="inline-block size-4" />{' '}
                        {influencer.instagram}
                      </a>
                      <p
                        className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-900/80 px-2.5 py-0.5"
                        title=" Nicho "
                      >
                        <Crosshair className="inline-block size-4" />{' '}
                        {influencer.niche}
                      </p>
                      <p
                        className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-900/80 px-2.5 py-0.5"
                        title="Alcance"
                      >
                        <Eye className="inline-block size-4" />{' '}
                        {influencer.reach}
                      </p>
                    </div>
                    <p title={formatDateTime(influencer.createdAt)}>
                      <b>Adicionado em</b>:{' '}
                      {dayjs(influencer.createdAt).format('DD/MM/YYYY')}
                    </p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-zinc-400">
              Sem influenciadores associados
            </p>
          )}
        </div>
      </div>

      <div className="text-sm opacity-70">
        <p title={formatDate(createdAt)}>
          Criado há {formatRelativeDate(createdAt)}
        </p>
        <p title={formatDate(updatedAt)}>
          Atualizado {formatRelativeDate(updatedAt) === 'agora' ? '' : 'há'}{' '}
          {formatRelativeDate(updatedAt)}
        </p>
      </div>
    </div>
  );
}
