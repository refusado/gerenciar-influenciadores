'use client';

import { RegisterInfluencerForm } from '@/components/influencer-modals/create-influencer';
import { DeleteInfluencerModal } from '@/components/influencer-modals/delete-influencer';
import { LinkBrand } from '@/components/influencer-modals/link-brand';
import { UpdateInfluencerForm } from '@/components/influencer-modals/update-influencer';
import { ViewInfluencerModal } from '@/components/influencer-modals/view-influencer';
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
  openModal: (modalName: string, resource?: Influencer) => void;
  closeModal: () => void;
  resource?: Influencer;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [openModalName, setOpenModalName] = useState<string | null>(null);
  const [resource, setResource] = useState<Influencer | undefined>();

  const openModal = useCallback((modalName: string, resource?: Influencer) => {
    setOpenModalName(modalName);
    setResource(resource);
  }, []);

  const closeModal = useCallback(() => {
    setOpenModalName(null);
    setResource(undefined);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, resource }}>
      {children}

      <ModalContainer
        modalName="create-influencer"
        open={openModalName === 'create-influencer'}
        title="Novo influenciador"
        description="Cadastre um novo influenciador no sistema"
      >
        <RegisterInfluencerForm />
      </ModalContainer>

      <ModalContainer
        modalName="view-influencer"
        open={openModalName === 'view-influencer'}
        title={`Detalhes influenciador #${resource?.id}`}
        description="Visualize as informações detalhadas do influenciador"
      >
        {resource && <ViewInfluencerModal resource={resource} />}
      </ModalContainer>

      <ModalContainer
        modalName="edit-influencer"
        open={openModalName === 'edit-influencer'}
        title={`Atualizar influenciador #${resource?.id}`}
        description="Edite as informações do influenciador"
      >
        {resource && <UpdateInfluencerForm influencerId={resource.id} />}
      </ModalContainer>

      <ModalContainer
        modalName="link-influencer"
        open={openModalName === 'link-influencer'}
        title={`Conectar influenciador #${resource?.id}`}
        description="Esta operação irá associar o influenciador a uma marca escolhida"
      >
        {resource && <LinkBrand resource={resource} />}
      </ModalContainer>

      <ModalContainer
        modalName="delete-influencer"
        open={openModalName === 'delete-influencer'}
        title={`Excluir influenciador #${resource?.id}`}
        description="Esta ação não poderá ser desfeita."
      >
        {resource && <DeleteInfluencerModal resource={resource} />}
      </ModalContainer>
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
