import * as Form from '@radix-ui/react-form';
import * as Tabs from '@radix-ui/react-tabs';

export default function Admin() {
  return (
    <main className="container animate-fade animate-duration-300">
      <h1>Bem vindo ao painel administrativo</h1>

      <p className="mb-4">Adm, faça login para continuar</p>

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
    </main>
  );
}

function LoginForm() {
  return (
    <Form.Root className="space-y-4">
      <Form.Field name="email">
        <Form.Label>Email</Form.Label>
        <Form.Control asChild>
          <input
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none selection:bg-red-500 selection:text-blue-500"
            type="email"
            required
            defaultValue={'teste@teste'}
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="password">
        <Form.Label>Senha</Form.Label>
        <Form.Control asChild>
          <input
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none selection:bg-red-500 selection:text-blue-500"
            type="password"
            required
            defaultValue={'123456'}
          />
        </Form.Control>
      </Form.Field>

      <Form.Submit className="w-full bg-purple-600/60 px-4 py-2">
        Entrar
      </Form.Submit>
    </Form.Root>
  );
}

function SignupForm() {
  return (
    <Form.Root className="space-y-4">
      <Form.Field name="name">
        <Form.Label>Nome</Form.Label>
        <Form.Control asChild>
          <input
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none selection:bg-red-500 selection:text-blue-500"
            type="text"
            required
            defaultValue={'Refu'}
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="email">
        <Form.Label>Email</Form.Label>
        <Form.Control asChild>
          <input
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none selection:bg-red-500 selection:text-blue-500"
            type="email"
            required
            defaultValue={'teste@teste'}
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="password">
        <Form.Label>Senha</Form.Label>
        <Form.Control asChild>
          <input
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none selection:bg-red-500 selection:text-blue-500"
            type="password"
            required
            defaultValue={'123456'}
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="password-confirm">
        <Form.Label>Confirmar senha</Form.Label>
        <Form.Control asChild>
          <input
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none selection:bg-red-500 selection:text-blue-500"
            type="password"
            required
            defaultValue={'123456'}
          />
        </Form.Control>
      </Form.Field>

      <Form.Submit className="w-full bg-purple-600/60 px-4 py-2">
        Entrar
      </Form.Submit>
    </Form.Root>
  );
}
