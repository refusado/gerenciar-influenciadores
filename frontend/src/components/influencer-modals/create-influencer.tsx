'use client';

import influencerApi from '@/app/admin/api/influencerApi';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  At,
  CaretDown,
  Crosshair,
  Eye,
  ImageSquare,
  InstagramLogo,
  MapPin,
  UserRectangle,
} from '@phosphor-icons/react/dist/ssr';
import * as Form from '@radix-ui/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { forwardRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ImageFileInput } from '../image-input';
import { registerInfluencerSchema } from './schemas/create-schema';
import { niches } from '../niches';

export const RegisterInfluencerForm = forwardRef<HTMLFormElement>(
  (props, ref) => {
    const queryClient = useQueryClient();
    const { mutateAsync } = useMutation({
      mutationFn: (data: FormData) => influencerApi.createInfluencer(data),
      onSettled() {
        queryClient.invalidateQueries({ queryKey: ['influencers'] });
      },
    });

    const [serverError, setServerError] = useState<boolean | string>(false);
    const { addToast } = useToast();
    const { closeModal } = useModal();

    const form = useForm<z.infer<typeof registerInfluencerSchema>>({
      resolver: zodResolver(registerInfluencerSchema),
      defaultValues: {
        name: 'Renan Freitas',
        instagram: 'refu.dev',
        niche: niches[31],
        reach: 31415,
        cep: '99999999',
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
      closeModal();
      addToast('Influencer criado com sucesso!');
    };

    async function submitForm(data: z.infer<typeof registerInfluencerSchema>) {
      setServerError(false);

      const formData = new FormData();

      formData.append('data', JSON.stringify(data));

      if (data.image[0]) {
        formData.append('image', data.image[0]);
      }

      try {
        const result = await mutateAsync(formData);
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
                message: 'Instagram associado a outro influenciador',
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
          className="flex flex-col gap-4 *:flex-1 md:flex-row"
          onSubmit={handleSubmit(submitForm)}
          ref={ref}
          {...props}
        >
          <div className="space-y-4">
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
          </div>

          <div className="flex flex-col justify-between *:space-y-4">
            <div>
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
                <div className="relative mb-1 inline-flex h-max w-full items-center">
                  <Form.Control asChild>
                    <select
                      {...register('niche')}
                      className="inline-block w-full cursor-pointer appearance-none px-3 py-2 leading-normal hover:brightness-125"
                    >
                      <option value={''} defaultChecked>
                        Selecione uma opção
                      </option>
                      {niches.map((niche, i) => (
                        <option key={i} value={niche}>
                          {niche}
                        </option>
                      ))}
                    </select>
                  </Form.Control>
                  <CaretDown className="absolute right-[0.75rem] size-5" />
                </div>
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
            </div>

            <div>
              <Form.Submit
                className="mt-4 w-full rounded-sm bg-purple-600/60 px-4 py-2 shadow-sm duration-100 hover:brightness-110 disabled:opacity-60"
                disabled={isSubmitting}
              >
                Criar Influencer
              </Form.Submit>

              {serverError && <p className="error-text">{serverError}</p>}
            </div>
          </div>
        </Form.Root>
      </FormProvider>
    );
  },
);

RegisterInfluencerForm.displayName = 'RegisterInfluencerForm';
