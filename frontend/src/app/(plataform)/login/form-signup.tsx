import * as Form from '@radix-ui/react-form';

export function SignupForm() {
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
