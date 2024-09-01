'use client';

import { useToast } from '@/components/toast';
import { api } from '@/utils/api';
import * as Form from '@radix-ui/react-form';
import axios from 'axios';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

export const LoginForm = forwardRef<HTMLFormElement>((props, ref) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();
  const [serverError, setServerError] = useState<boolean | string>(false);

  async function submitForm(data: FormData) {
    setServerError(false);
    try {
      const response = await api.post('/login', data);
      reset();
      window.location.href = '/admin?message=login';
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

          setServerError('Email nao encontrado');
        }

        if (status === 401) {
          console.error('Unauthorized:', data.message);
          if (data.error) console.error(data.error);

          setServerError('Senha incorreta, tente novamente.');
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
      {...props}
      ref={ref}
    >
      <Form.Field name="email">
        <Form.Label>Email</Form.Label>
        <Form.Control asChild>
          <input
            {...register('email', {
              required: {
                value: true,
                message: 'Email obrigatório',
              },
            })}
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none"
            type="email"
            placeholder="email@exemplo.com"
            autoComplete="off"
          />
        </Form.Control>
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </Form.Field>

      <Form.Field name="password">
        <Form.Label>Senha</Form.Label>
        <Form.Control asChild>
          <input
            {...register('password', {
              required: {
                value: true,
                message: 'Insira uma senha',
              },
            })}
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none"
            type="password"
          />
        </Form.Control>
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
      </Form.Field>

      <Form.Submit
        className="w-full bg-purple-600/60 px-4 py-2 disabled:opacity-60"
        disabled={isSubmitting}
      >
        Entrar
      </Form.Submit>

      {serverError && (
        <p className="text-red-600">
          {typeof serverError === 'string'
            ? serverError
            : 'Erro ao realizar login, tente novamente mais tarde.'}
        </p>
      )}
    </Form.Root>
  );
});

LoginForm.displayName = 'LoginForm';
