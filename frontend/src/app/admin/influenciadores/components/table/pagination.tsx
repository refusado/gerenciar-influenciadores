import { Pagination as ArkPagination } from '@ark-ui/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr';

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  data: {
    hasMore: boolean;
    totalInfluencers: number;
    limit: number;
  };
}

export function Pagination({
  page: currentPage,
  setPage,
  data,
}: PaginationProps) {
  return (
    <ArkPagination.Root
      className="flex items-center justify-center gap-2 p-2 font-mono *:flex *:size-9 *:items-center *:justify-center *:rounded-sm *:border-[1px] *:border-zinc-800 *:bg-purple-950/10"
      count={data.totalInfluencers}
      pageSize={data.limit}
      siblingCount={1}
      page={currentPage}
      onPageChange={(info) => setPage(info.page)}
    >
      <ArkPagination.PrevTrigger className="disabled:opacity-50">
        <CaretLeft className="size-5" />
      </ArkPagination.PrevTrigger>
      <ArkPagination.Context>
        {(pagination) =>
          pagination.pages.map((page, index) =>
            page.type === 'page' ? (
              <ArkPagination.Item
                className="data-[selected]:pointer-events-none data-[selected]:cursor-default data-[selected]:border-transparent data-[selected]:opacity-40"
                key={index}
                {...page}
              >
                {page.value}
              </ArkPagination.Item>
            ) : (
              <ArkPagination.Ellipsis
                className="pointer-events-none flex size-9 select-none items-center justify-center font-mono"
                key={index}
                index={index}
              >
                &#8230;
              </ArkPagination.Ellipsis>
            ),
          )
        }
      </ArkPagination.Context>
      <ArkPagination.NextTrigger className="disabled:opacity-50">
        <CaretRight className="size-5" />
      </ArkPagination.NextTrigger>
    </ArkPagination.Root>
  );
}
