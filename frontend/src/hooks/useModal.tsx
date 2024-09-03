'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface ModalContextType {
  openModal: (modalName: string, id?: number) => void;
  closeModal: () => void;
  resourceId?: number;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [openModalName, setOpenModalName] = useState<string | null>(null);
  const [resourceId, setResourceId] = useState<number | undefined>();

  const openModal = useCallback((modalName: string, resourceId?: number) => {
    setOpenModalName(modalName);
    setResourceId(resourceId);
  }, []);

  const closeModal = useCallback(() => {
    setOpenModalName(null);
    setResourceId(undefined);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, resourceId }}>
      {children}

      <ModalContainer
        modalName="create-influencer"
        open={openModalName === 'create-influencer'}
      >
        <Dialog.Title>Cadrastar influenciador</Dialog.Title>
      </ModalContainer>

      <ModalContainer
        modalName="view-influencer"
        open={openModalName === 'view-influencer'}
      >
        <Dialog.Title>Ver detalhes do influenciador #{resourceId}</Dialog.Title>
      </ModalContainer>

      <ModalContainer
        modalName="edit-influencer"
        open={openModalName === 'edit-influencer'}
      >
        <Dialog.Title>Editar influenciador #{resourceId}</Dialog.Title>
      </ModalContainer>

      <ModalContainer
        modalName="link-influencer"
        open={openModalName === 'link-influencer'}
      >
        <Dialog.Title>Associar influencer #{resourceId} uma marca</Dialog.Title>
      </ModalContainer>

      <ModalContainer
        modalName="delete-influencer"
        open={openModalName === 'delete-influencer'}
      >
        <Dialog.Title>
          Tem certeza que deseja excluir o influenciador #{resourceId}?
        </Dialog.Title>
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
  open: boolean;
  children: ReactNode;
  resourceId?: number;
}

function ModalContainer({
  modalName,
  open,
  children,
  resourceId,
}: ModalContainerProps) {
  const { closeModal } = useModal();

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 bg-zinc-800 p-4">
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
}
