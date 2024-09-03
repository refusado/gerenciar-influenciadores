'use client';

import { createContext, useContext, useState } from 'react';
import * as RadixToast from '@radix-ui/react-toast';

type ToastContextProps = {
  addToast: (message: string) => void;
};

const toastContext = createContext<ToastContextProps | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);

  const addToast = (message: string) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { id: `${Date.now()}${Math.random()}`, message },
    ]);
  };

  return (
    <toastContext.Provider value={{ addToast }}>
      {children}

      <RadixToast.Provider duration={6000} swipeDirection="left">
        {toasts.map(({ id, message }) => (
          <RadixToast.Root
            key={id}
            className="ToastRoot border-l-2 border-zinc-200 bg-zinc-700 px-5 py-3 shadow-md"
          >
            {message}
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed bottom-6 left-6 z-30 flex w-full max-w-[360px] flex-col gap-4" />
      </RadixToast.Provider>
    </toastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(toastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');

  return context;
};
