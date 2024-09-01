export default function Home() {
  return (
    // the animation delay will prevent the page from flickering on redirects
    <main className="container animate-fade animate-delay-[350ms] animate-duration-300">
      <h1>Bem vindo ao site, usuário</h1>
    </main>
  );
}
