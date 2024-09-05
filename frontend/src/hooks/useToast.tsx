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
            className="ToastRoot overflow-hidden rounded-sm bg-zinc-700 shadow-lg"
          >
            <p className="size-full border-l-2 border-purple-200 bg-yellow-300/5 px-5 py-3">
              {message}
            </p>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed bottom-0 z-30 flex w-[clamp(280px,100vw,420px)] flex-col gap-4 p-6 sm:left-0" />
      </RadixToast.Provider>
    </toastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(toastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');

  return context;
};
