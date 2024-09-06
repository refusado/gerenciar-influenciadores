'use client';

import { RegisterBrandForm } from '@/components/brand-modals/create-brand';
import { DeleteBrandModal } from '@/components/brand-modals/delete-brand';
import { UpdateBrandForm } from '@/components/brand-modals/update-brand';
import { ViewBrandModal } from '@/components/brand-modals/view-brand';
import { RegisterInfluencerForm } from '@/components/influencer-modals/create-influencer';
import { DeleteInfluencerModal } from '@/components/influencer-modals/delete-influencer';
import { LinkBrand } from '@/components/influencer-modals/link-brand';
import { UpdateInfluencerForm } from '@/components/influencer-modals/update-influencer';
import { ViewInfluencerModal } from '@/components/influencer-modals/view-influencer';
import { BrandResponse } from '@/types/brand';
import { Influencer } from '@/types/influencer';
import { X } from '@phosphor-icons/react/dist/ssr';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

interface ModalContextType {
  openModal: (
    modalName: string,
    resource?: Influencer,
    brand?: BrandResponse,
  ) => void;
  closeModal: () => void;
  resource?: Influencer;
  brandData?: BrandResponse;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [openModalName, setOpenModalName] = useState<string | null>(null);
  const [resource, setResource] = useState<Influencer | undefined>();
  const [brandData, setBrandData] = useState<BrandResponse | undefined>();

  const openModal = useCallback(
    (modalName: string, influencer?: Influencer, brand?: BrandResponse) => {
      if (influencer && brand)
        throw new Error('openModal cannot receive both influencer AND brand');

      // reset the modal content state before opening a new modal
      setResource(undefined);
      setBrandData(undefined);

      setOpenModalName(modalName);
      setResource(influencer);
      setBrandData(brand);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setOpenModalName(null);
    setResource(undefined);
    setBrandData(undefined);
  }, []);

  // title e description are passed outside the modal content for accessibility
  // reasons: https://www.radix-ui.com/primitives/docs/components/dialog#title
  const MODALS = [
    {
      modalName: 'create-influencer',
      title: 'Novo influenciador',
      description: 'Cadastre um novo influenciador no sistema',
      content: <RegisterInfluencerForm />,
    },
    {
      modalName: 'view-influencer',
      title: `Detalhes influenciador #${resource?.id}`,
      description: 'Visualize as informações detalhadas do influenciador',
      content: resource ? <ViewInfluencerModal resource={resource} /> : null,
    },
    {
      modalName: 'edit-influencer',
      title: `Atualizar influenciador #${resource?.id}`,
      description: 'Edite as informações do influenciador',
      content: resource ? (
        <UpdateInfluencerForm
          influencerId={resource?.id}
          onCancel={() => openModal('view-influencer', resource)}
        />
      ) : null,
    },
    {
      modalName: 'link-influencer',
      title: `Conectar influenciador #${resource?.id}`,
      description:
        'Esta operação irá associar o influenciador a uma marca escolhida',
      content: resource ? <LinkBrand resource={resource} /> : null,
    },
    {
      modalName: 'delete-influencer',
      title: `Excluir influenciador #${resource?.id}`,
      description: 'Esta ação não poderá ser desfeita.',
      content: resource ? <DeleteInfluencerModal resource={resource} /> : null,
    },
    {
      modalName: 'create-brand',
      title: 'Nova marca',
      description: 'Cadastre uma nova marca no sistema',
      content: <RegisterBrandForm />,
    },
    {
      modalName: 'view-brand',
      title: `Detalhes marca #${brandData?.id}`,
      description: 'Visualize as informações detalhadas da marca',
      content: brandData ? <ViewBrandModal brand={brandData} /> : null,
    },
    {
      modalName: 'delete-brand',
      title: `Excluir marca #${brandData?.id}`,
      description:
        'Verifique todas as informações antes de realizar a operação.',
      content: brandData ? <DeleteBrandModal brand={brandData} /> : null,
    },
    {
      modalName: 'edit-brand',
      title: `Atualizar marca #${brandData?.id}`,
      description: 'Edite as informações da marcda.',
      content: brandData ? (
        <UpdateBrandForm
          brandId={brandData.id}
          onCancel={() => openModal('view-brand', undefined, brandData)}
        />
      ) : null,
    },
  ];

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, resource, brandData }}
    >
      {children}
      {MODALS.map(({ modalName, title, description, content }) => (
        <ModalContainer
          key={modalName}
          modalName={modalName}
          title={title}
          description={description}
          open={openModalName === modalName}
        >
          {content}
        </ModalContainer>
      ))}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
}

interface ModalContainerProps {
  modalName: string;
  title: string;
  description: string;
  open: boolean;
  children: ReactNode;
}

function ModalContainer({
  modalName,
  title,
  description,
  open,
  children,
}: ModalContainerProps) {
  const { closeModal } = useModal();

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <Dialog.Overlay className="fixed inset-0 z-20 bg-black/50" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[clamp(300px,90vw,800px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md bg-zinc-800 p-4">
        <Dialog.Title className="mb-2 text-2xl">{title}</Dialog.Title>
        <Dialog.Description className="mb-2">{description}</Dialog.Description>
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 rounded-full p-1 duration-75 hover:bg-zinc-950/70"
        >
          <X className="size-6" />
        </button>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
}
