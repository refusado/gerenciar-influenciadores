'use client';

import { api } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Envelope, Key } from '@phosphor-icons/react/dist/ssr';
import * as Form from '@radix-ui/react-form';
import axios from 'axios';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export const LoginForm = forwardRef<HTMLFormElement>((props, ref) => {
  const [serverError, setServerError] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: 'renanfreitas.contato@gmail.com',
      password: 'teste123',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = form;

  const onSuccess = () => {
    reset();
    window.location.href = '/admin?message=login';
  };

  async function submitForm(data: z.infer<typeof FormSchema>) {
    setServerError(false);

    try {
      await api.post('/login', data);
      return onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          console.error('Bad Request:', data.message);
          if (data.error) console.error(data.error);

          setServerError(true);
        }

        if (status === 404) {
          console.error('Not Found:', data.message);
          if (data.error) console.error(data.error);

          setError('email', { message: 'Email nao encontrado' });
        }

        if (status === 401) {
          console.error('Unauthorized:', data.message);
          if (data.error) console.error(data.error);

          setError('password', { message: 'Senha incorreta' });
        }
      } else {
        console.error('Unexpected Error:', error);
        setServerError(true);
      }
    }
  }

  return (
    <Form.Root
      className="space-y-4"
      onSubmit={handleSubmit(submitForm)}
      ref={ref}
      {...props}
    >
      <Form.Field name="email" serverInvalid={!!errors.email}>
        <Form.Label className="mb-1 flex items-center gap-2">
          <Envelope className="size-5 opacity-80" /> Email
        </Form.Label>
        <Form.Control asChild>
          <input
            {...register('email')}
            className="mb-1 inline-block w-full appearance-none px-3 py-2 leading-none"
            type="email"
            placeholder="seuemail@exemplo.com"
            autoComplete="off"
          />
        </Form.Control>
        {errors.email && (
          <Form.Message className="error-text">
            {errors.email.message}
          </Form.Message>
        )}
      </Form.Field>

      <Form.Field name="password" serverInvalid={!!errors.password}>
        <Form.Label className="mb-1 flex items-center gap-2">
          <Key className="size-5 opacity-80" /> Senha
        </Form.Label>
        <Form.Control asChild>
          <input
            {...register('password')}
            className="mb-1 inline-block w-full appearance-none px-3 py-2 leading-none"
            type="password"
            placeholder="senha123"
            autoComplete="off"
          />
        </Form.Control>
        {errors.password && (
          <Form.Message className="error-text">
            {errors.password.message}
          </Form.Message>
        )}
      </Form.Field>

      <Form.Submit
        className="w-full bg-purple-600/60 px-4 py-2 duration-100 hover:brightness-110 disabled:opacity-60"
        disabled={isSubmitting}
      >
        Entrar
      </Form.Submit>

      {serverError && (
        <p className="error-text">
          Erro ao realizar login, tente novamente mais tarde.
        </p>
      )}
    </Form.Root>
  );
});

LoginForm.displayName = 'LoginForm';
