'use client';

import * as Form from '@radix-ui/react-form';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const { handleSubmit, register } = useForm<FormData>();

  async function submitForm(data: FormData) {
    try {
      const response = await fetch('http://localhost:3333/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        credentials: 'include',
      });
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <Form.Root className="space-y-4" onSubmit={handleSubmit(submitForm)}>
      <Form.Field name="email">
        <Form.Label>Email</Form.Label>
        <Form.Control asChild>
          <input
            {...register('email')}
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none selection:bg-red-500 selection:text-blue-500"
            type="email"
            required
            defaultValue={'refusadd@gmail.com'}
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="password">
        <Form.Label>Senha</Form.Label>
        <Form.Control asChild>
          <input
            {...register('password')}
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none selection:bg-red-500 selection:text-blue-500"
            type="text"
            required
            defaultValue={'teste123'}
          />
        </Form.Control>
      </Form.Field>

      <Form.Submit className="w-full bg-purple-600/60 px-4 py-2">
        Entrar
      </Form.Submit>
    </Form.Root>
  );
}
