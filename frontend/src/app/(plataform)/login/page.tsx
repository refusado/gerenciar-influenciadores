'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { LoginForm } from './form-login';
import { SignupForm } from './form-signup';

export default function Login() {
  async function logout() {
    const response = await fetch('http://localhost:3333/api/logout', {
      method: 'delete',
      credentials: 'include',
    });

    if (response.ok) {
      console.log('done');
      window.location.href = '/';
    }
  }

  return (
    <main className="container animate-fade animate-duration-300">
      <h1>Entrar</h1>

      <p className="mb-4">
        Administrador, faça login para ter acesso ao painel de gerenciamento.
      </p>
      <p className="mb-4 italic opacity-50">
        Para finalidade de teste, aqui mesmo é possível criar uma conta
      </p>

      <Tabs.Root defaultValue="login" className="max-w-md">
        <Tabs.List className="flex *:w-full">
          <Tabs.Trigger
            className="bg-zinc-700 px-4 py-2 data-[state='active']:pointer-events-none data-[state='active']:opacity-70"
            value="login"
          >
            Entrar
          </Tabs.Trigger>
          <Tabs.Trigger
            className="bg-zinc-700 px-4 py-2 data-[state='active']:pointer-events-none data-[state='active']:opacity-70"
            value="signup"
          >
            Criar conta
          </Tabs.Trigger>
        </Tabs.List>
        <div className="bg-zinc-200/5 p-4">
          <Tabs.Content value="login">
            <LoginForm />
          </Tabs.Content>
          <Tabs.Content value="signup">
            <SignupForm />
          </Tabs.Content>
        </div>
      </Tabs.Root>

      <button className="mt-4 bg-red-700/70 px-4 py-2" onClick={logout}>
        Sair
      </button>
    </main>
  );
}
