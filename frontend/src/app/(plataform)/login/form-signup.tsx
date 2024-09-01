'use client';

import { api } from '@/utils/api';
import * as Form from '@radix-ui/react-form';
import axios from 'axios';
import { forwardRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  password: string;
};

export const SignupForm = forwardRef<HTMLFormElement>((props, ref) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [serverError, setServerError] = useState<boolean | string>(false);
  const [sending, setSending] = useState(false);

  async function submitForm(data: FormData) {
    setServerError(false);
    setSending(true);

    try {
      const response = await api.post('/signup', data);

      console.log('Admin created successfully:', response.data);
      alert('Conta criada com sucesso!');
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response;

          if (status === 400) {
            console.error('Validation Error:', data.message);
            if (data.error) {
              console.error('Validation Details:', data.error);
            }

            setServerError(true);
          } else if (status === 409) {
            console.error('Conflict Error:', data.message);

            if (data.message.includes('email address already exists')) {
              setServerError('Este email ja existe no sistema');
            } else {
              setServerError(true);
            }
          } else {
            console.error(`Unexpected Error (Status ${status}):`, data.message);
            setServerError(true);
          }
        } else {
          console.error(
            'Network Error or Server did not respond:',
            error.message,
          );
        }
      } else {
        console.error('Unexpected Error:', error);
      }
    }

    setSending(false);
  }

  return (
    <Form.Root
      className="space-y-4"
      onSubmit={handleSubmit(submitForm)}
      {...props}
      ref={ref}
    >
      <Form.Field name="name">
        <Form.Label>Nome</Form.Label>
        <Form.Control asChild>
          <input
            {...register('name', {
              required: {
                value: true,
                message: 'Nome obrigatório',
              },
              minLength: {
                value: 3,
                message: 'Nome muito curto',
              },
              maxLength: {
                value: 30,
                message: 'Nome muito longo',
              },
            })}
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none"
            type="text"
            placeholder="Seu nome"
            autoComplete="off"
          />
        </Form.Control>
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      </Form.Field>

      <Form.Field name="email">
        <Form.Label>Email</Form.Label>
        <Form.Control asChild>
          <input
            {...register('email', {
              required: {
                value: true,
                message: 'Email obrigatório',
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none"
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
              minLength: {
                value: 6,
                message: 'A senha deve ter no mínimo 6 caracteres',
              },
              maxLength: {
                value: 50,
                message: 'Senha muito longa',
              },
            })}
            className="inline-flex w-full appearance-none items-center justify-center px-3 py-2 leading-none outline-none"
            type="password"
          />
        </Form.Control>
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
      </Form.Field>

      <Form.Submit
        className="w-full bg-purple-600/60 px-4 py-2 disabled:opacity-60"
        disabled={sending}
      >
        Entrar
      </Form.Submit>

      {serverError && (
        <p className="text-red-600">
          {typeof serverError === 'string'
            ? serverError
            : 'Erro ao cadastrar, tente novamente mais tarde.'}
        </p>
      )}
    </Form.Root>
  );
});

SignupForm.displayName = 'SignupForm';
