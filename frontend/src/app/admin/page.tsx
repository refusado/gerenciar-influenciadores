'use client';

import { useRouter } from 'next/navigation';

export default function Admin() {
  const router = useRouter();

  async function logout() {
    const response = await fetch('http://localhost:3333/api/logout', {
      method: 'delete',
      credentials: 'include',
    });

    if (response.ok) {
      console.log(response);
      router.push('/?logout');
    }
  }

  return (
    <main className="container animate-fade animate-duration-300">
      <h1>Bem vindo ao painel administrativo</h1>

      <button className="mt-4 bg-red-700/70 px-4 py-2" onClick={logout}>
        Sair
      </button>
    </main>
  );
}
