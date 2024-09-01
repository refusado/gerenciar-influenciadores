export default function Admin() {
  return (
    <main className="container animate-fade animate-duration-300">
      <h1>Bem vindo ao painel administrativo</h1>

      <a
        className="mt-4 bg-red-700/70 px-4 py-2 text-zinc-100"
        href="/api/logout"
      >
        Sair
      </a>
    </main>
  );
}
