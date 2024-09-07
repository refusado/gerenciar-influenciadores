'use client';

import authApi from '@/app/admin/api/authApi';
import { useToast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Envelope, Key, UserRectangle } from '@phosphor-icons/react/dist/ssr';
import * as Form from '@radix-ui/react-form';
import axios from 'axios';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  name: z
    .string()
    .min(1, 'É necessário informar um nome')
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(32, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(1, 'É necessário informar uma senha')
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha muito longa')
    .refine((pass) => /[0-9]/.test(pass), {
      message: 'A senha deve conter pelo menos um número',
    }),
});

export const SignupForm = forwardRef<HTMLFormElement>((props, ref) => {
  const [serverError, setServerError] = useState<boolean | string>(false);
  const { addToast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
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
    addToast('Conta criada com sucesso!');
  };

  async function submitForm(data: z.infer<typeof FormSchema>) {
    setServerError(false);

    try {
      await authApi.register(data);
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          console.error('Bad Request:', data.message);
          if (data.error) console.error(data.error);

          setServerError(true);
        } else if (status === 409) {
          console.error('Conflict Error:', data.message);

          if (data.message.includes('email address already exists')) {
            setError('email', { message: 'Este email ja existe no sistema' });
          } else {
            setServerError(true);
          }
        } else {
          console.error(`Unexpected Error (Status ${status}):`, data.message);
          setServerError(true);
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
      <Form.Field name="name" serverInvalid={!!errors.name}>
        <Form.Label className="mb-1 flex items-center gap-2">
          <UserRectangle className="size-5 opacity-80" /> Nome
        </Form.Label>
        <Form.Control asChild>
          <input
            {...register('name')}
            className="mb-1 inline-block w-full appearance-none px-3 py-2 leading-none"
            type="text"
            placeholder="Seu nome"
            autoComplete="off"
          />
        </Form.Control>
        {errors.name && (
          <Form.Message className="error-text">
            {errors.name.message}
          </Form.Message>
        )}
      </Form.Field>
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
        Cadastrar
      </Form.Submit>

      {serverError && (
        <p className="error-text">
          Erro ao realizar login, tente novamente mais tarde.
        </p>
      )}
    </Form.Root>
  );
});

SignupForm.displayName = 'SignupForm';
