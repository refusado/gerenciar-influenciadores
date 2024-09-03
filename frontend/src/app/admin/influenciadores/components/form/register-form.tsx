'use client';

import { useToast } from '@/components/toast';
import { api } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  At,
  Crosshair,
  Eye,
  ImageSquare,
  InstagramLogo,
  MapPin,
  UserRectangle,
} from '@phosphor-icons/react/dist/ssr';
import * as Form from '@radix-ui/react-form';
import axios from 'axios';
import { forwardRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ImageFileInput } from './image-input';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const registerInfluencerSchema = z.object({
  name: z
    .string()
    .min(1, 'É necessário informar um nome')
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(32, 'Nome muito longo'),
  instagram: z
    .string()
    .min(1, 'É necessário informar um Instagram')
    .min(3, 'Instagram muito curto')
    .max(32, 'Instagram muito longo'),
  niche: z.string().min(1, 'Insira um nicho'),
  reach: z
    .number({
      required_error: 'Campo obrigatório',
      invalid_type_error: 'Número inválido',
    })
    .min(1, 'Número inválido'),
  cep: z
    .string()
    .min(1, 'É necessário informar um CEP')
    .length(8, 'O CEP deve ter 8 caracteres'),
  image: z
    .any()
    .optional()
    .refine(
      (file) =>
        file.length == 1
          ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
            ? true
            : false
          : true,
      'A imagem deve ser do tipo jpeg, jpg, png ou webp.',
    )
    .refine(
      (file) =>
        file.length == 1
          ? file[0]?.size <= MAX_FILE_SIZE
            ? true
            : false
          : true,
      'A imagem deve ter no máximo 5 MB.',
    ),
});

export const RegisterInfluencerForm = forwardRef<HTMLFormElement>(
  (props, ref) => {
    const [serverError, setServerError] = useState<boolean | string>(false);
    const { addToast } = useToast();

    const form = useForm<z.infer<typeof registerInfluencerSchema>>({
      resolver: zodResolver(registerInfluencerSchema),
      defaultValues: {
        name: '',
        instagram: '',
        niche: '',
        cep: '',
      },
    });

    const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
      reset,
      setError,
      setValue,
    } = form;

    const onSuccess = () => {
      reset();
      setValue('image', '');
      addToast('Influencer criado com sucesso!');
    };

    async function submitForm(data: z.infer<typeof registerInfluencerSchema>) {
      setServerError(false);

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (data.image[0]) formData.append('image', data.image[0]);

      try {
        await api.post('/influencer', formData);
        onSuccess();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const { status, data } = error.response;

          if (status >= 400 && status < 500) {
            console.error('Bad Request:', data.message);
            if (data.error) console.error(data.error);

            if (data.message.includes('Error searching for CEP: notFound')) {
              setError('cep', {
                message: 'CEP não encontrado',
              });
            }

            if (data.message.includes('Influencer already exists')) {
              setError('instagram', {
                message: 'Instagram associado a outro influencer cadastrado',
              });
            }
          } else {
            console.error(`Unexpected Error (Status ${status}):`, data.message);
            setServerError('Erro inesperado, tente novamente.');
          }
        } else {
          console.error('Unexpected Error:', error);
          setServerError('Erro inesperado, tente novamente.');
        }
      }
    }

    return (
      <FormProvider {...form}>
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
                placeholder="Nome do influencer"
                autoComplete="off"
              />
            </Form.Control>
            {errors.name && (
              <Form.Message className="error-text">
                {errors.name.message}
              </Form.Message>
            )}
          </Form.Field>
          <Form.Field name="instagram" serverInvalid={!!errors.instagram}>
            <Form.Label className="mb-1 flex items-center gap-2">
              <InstagramLogo className="size-5 opacity-80" /> Instagram
            </Form.Label>
            <div className="relative mb-1 inline-flex h-max w-full items-center">
              <Form.Control asChild>
                <input
                  {...register('instagram')}
                  className="h-full w-full appearance-none px-3 py-2 pl-[2rem] leading-none"
                  type="text"
                  placeholder="usuariotal"
                  autoComplete="off"
                />
              </Form.Control>
              <At className="absolute left-[0.75rem] size-5" />
            </div>
            {errors.instagram && (
              <Form.Message className="error-text">
                {errors.instagram.message}
              </Form.Message>
            )}
          </Form.Field>

          <Form.Field name="niche" serverInvalid={!!errors.niche}>
            <Form.Label className="mb-1 flex items-center gap-2">
              <Crosshair className="size-5 opacity-80" /> Nicho
            </Form.Label>
            <Form.Control asChild>
              <input
                {...register('niche')}
                className="mb-1 inline-block w-full appearance-none px-3 py-2 leading-none"
                type="text"
                placeholder="Educação"
                autoComplete="off"
              />
            </Form.Control>
            {errors.niche && (
              <Form.Message className="error-text">
                {errors.niche.message}
              </Form.Message>
            )}
          </Form.Field>

          <Form.Field name="reach" serverInvalid={!!errors.reach}>
            <Form.Label className="mb-1 flex items-center gap-2">
              <Eye className="size-5 opacity-80" /> Alcance
            </Form.Label>
            <Form.Control asChild>
              <input
                {...register('reach', {
                  valueAsNumber: true,
                })}
                className="mb-1 inline-block w-full appearance-none px-3 py-2 leading-none"
                type="text"
                placeholder="32000"
                autoComplete="off"
              />
            </Form.Control>
            {errors.reach && (
              <Form.Message className="error-text">
                {errors.reach.message}
              </Form.Message>
            )}
          </Form.Field>

          <Form.Field name="cep" serverInvalid={!!errors.cep}>
            <Form.Label className="mb-1 flex items-center gap-2">
              <MapPin className="size-5 opacity-80" /> CEP
            </Form.Label>
            <Form.Control asChild>
              <input
                {...register('cep')}
                className="mb-1 inline-block w-full appearance-none px-3 py-2 leading-none"
                type="text"
                placeholder="12345678"
                autoComplete="off"
              />
            </Form.Control>
            {errors.cep && (
              <Form.Message className="error-text">
                {errors.cep.message}
              </Form.Message>
            )}
          </Form.Field>

          <Form.Field name="image">
            <Form.Label className="mb-1 flex items-center gap-2">
              <ImageSquare className="size-5 opacity-80" /> Foto de perfil
            </Form.Label>

            <ImageFileInput {...register('image')} />

            {errors.image && typeof errors.image.message == 'string' && (
              <Form.Message className="error-text">
                {errors.image.message}
              </Form.Message>
            )}
          </Form.Field>

          <Form.Submit
            className="mt-4 w-full bg-purple-600/60 px-4 py-2 duration-100 hover:brightness-110 disabled:opacity-60"
            disabled={isSubmitting}
          >
            Criar Influencer
          </Form.Submit>

          {serverError && <p className="error-text">{serverError}</p>}
        </Form.Root>
      </FormProvider>
    );
  },
);

RegisterInfluencerForm.displayName = 'UploadImage';
