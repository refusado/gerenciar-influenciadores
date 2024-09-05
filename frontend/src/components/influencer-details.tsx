import influencerApi from '@/app/admin/api/influencerApi';
import { useToast } from '@/hooks/useToast';
import { formatDate, formatRelativeDate } from '@/lib/format-date';
import { UniqueInfluencerResponse } from '@/types/influencer';
import {
  Clipboard,
  Crosshair,
  Eye,
  InstagramLogo,
  MapPin,
} from '@phosphor-icons/react/dist/ssr';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

export function InfluencerDetails({ influencerId }: { influencerId: number }) {
  const { data } = useQuery<UniqueInfluencerResponse>({
    queryKey: ['influencer'],
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
              <h4 className="mb-2 text-lg font-semibold">Marcas</h4>
              <div className="flex flex-col gap-2">
                {brands.map((brandObj, index) => (
                  <div
                    key={index}
                    className="rounded bg-zinc-700/30 p-2 text-sm shadow-sm"
                  >
                    <h3 className="text-base font-semibold">
                      {brandObj.brand.name}
                    </h3>
                    <p className="mb-2">{brandObj.brand.description}</p>
                    <p>
                      <b>Nicho</b>: {brandObj.brand.niche}
                    </p>
                    <p>
                      <b>Adicionado em</b>:{' '}
                      {dayjs(brandObj.brand.createdAt).format('DD/MM/YYYY')}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-zinc-400">
              Sem marcas associadas
            </p>
          )}
        </div>

        <button
          onClick={copyInfluencerData}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-purple-700/15 text-zinc-300 opacity-50 hover:opacity-100"
          title="Copiar dados do influenciador"
        >
          <Clipboard className="size-5" />
        </button>
      </div>

      <div className="text-sm opacity-70">
        <p title={formatDate(createdAt)}>
          Criado há {formatRelativeDate(createdAt)}
        </p>
        <p title={formatDate(updateAt)}>
          Atualizado
          {formatRelativeDate(updateAt) === 'agora' ? '' : 'há'}{' '}
          {formatRelativeDate(updateAt)}
        </p>
      </div>
    </div>
  );
}
