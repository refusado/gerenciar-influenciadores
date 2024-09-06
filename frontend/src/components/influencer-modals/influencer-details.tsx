import influencerApi from '@/app/admin/api/influencerApi';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import {
  formatDate,
  formatDateTime,
  formatRelativeDate,
} from '@/lib/format-date';
import { UniqueInfluencerResponse } from '@/types/influencer';
import {
  Clipboard,
  Crosshair,
  Eye,
  InstagramLogo,
  MapPin,
  Tag,
} from '@phosphor-icons/react/dist/ssr';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

export function InfluencerDetails({ influencerId }: { influencerId: number }) {
  const { openModal } = useModal();
  const { data } = useQuery<UniqueInfluencerResponse>({
    queryKey: ['influencers'],
    queryFn: () => influencerApi.getInfluencerById(influencerId),
  });
  const { addToast } = useToast();

  if (!data) return <p>Carregando...</p>;

  const {
    id,
    name,
    instagram,
    niche,
    reach,
    street,
    neighborhood,
    city,
    state,
    cep,
    brands,
    createdAt,
    updateAt,
  } = data;

  function copyInfluencerData() {
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

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <a
            href={`http://www.instagram.com/-${instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-800/80 px-2.5 py-0.5 hover:bg-purple-800/15"
            title="Perfil no Instagram"
          >
            <InstagramLogo className="inline-block size-4" /> {instagram}
          </a>
          <p
            className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-800/80 px-2.5 py-0.5"
            title=" Nicho "
          >
            <Crosshair className="inline-block size-4" /> {niche}
          </p>
          <p
            className="flex items-center gap-1.5 rounded-full border border-zinc-700/30 bg-zinc-800/80 px-2.5 py-0.5"
            title="Alcance"
          >
            <Eye className="inline-block size-4" /> {reach}
          </p>
        </div>

        <div className="mb-4">
          <p className="flex items-start gap-2 text-zinc-300" title={cep}>
            <MapPin className="inline-block size-5 flex-shrink-0" />
            {street}, {neighborhood}, {city} - {state}
          </p>
        </div>

        <hr className="mb-6 border-zinc-700/50" />

        <div>
          {brands.length ? (
            <>
              <h4 className="mb-2 text-lg font-semibold">
                <Tag className="mr-2 inline-block size-5" />
                Marcas associadas
              </h4>
              <div className="flex flex-col gap-2">
                {brands.map(({ brand }, index) => (
                  <button
                    onClick={() => openModal('view-brand', undefined, brand)}
                    key={index}
                    className="group rounded border border-purple-100/10 bg-purple-200/5 p-2 text-start text-sm shadow-sm duration-200 hover:bg-purple-300/5"
                    title={`Visualizar detalhes da marca #${brand.id}`}
                  >
                    <h3 className="flex text-base font-semibold group-hover:underline">
                      {brand.name}{' '}
                      <span className="ml-auto inline-block opacity-35">
                        #{brand.id}
                      </span>
                    </h3>
                    <p className="mb-2 opacity-70">{brand.description}</p>
                    <p>
                      <b>Nicho</b>: {brand.niche}
                    </p>
                    <p title={formatDateTime(brand.createdAt)}>
                      <b>Adicionado em</b>:{' '}
                      {dayjs(brand.createdAt).format('DD/MM/YYYY')}
                    </p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-zinc-400">
              Sem marcas associadas
            </p>
          )}
        </div>
      </div>

      <div className="text-sm opacity-70">
        <p title={formatDate(createdAt)}>
          Criado há {formatRelativeDate(createdAt)}
        </p>
        <p title={formatDate(updateAt)}>
          Atualizado {formatRelativeDate(updateAt) === 'agora' ? '' : 'há'}{' '}
          {formatRelativeDate(updateAt)}
        </p>
      </div>
    </div>
  );
}
