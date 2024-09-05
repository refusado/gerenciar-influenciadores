'use client';

import influencerApi from '@/app/admin/api/influencerApi';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { forwardRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ImageFileInput } from '../image-input';
import { niches } from './niches';
import { updateInfluencerSchema } from './schemas/update-schema';

export const UpdateInfluencerForm = forwardRef<
  HTMLFormElement,
  { influencerId: number }
>(({ influencerId, ...props }, ref) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (data: FormData) =>
      influencerApi.updateInfluencer(influencerId, data),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['influencers'] });
    },
  });

  const [serverError, setServerError] = useState<boolean | string>(false);
  const { addToast } = useToast();
  const { closeModal, openModal } = useModal();

  const form = useForm<z.infer<typeof updateInfluencerSchema>>({
    resolver: zodResolver(updateInfluencerSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    setError,
    setValue,
    watch,
  } = form;

  const onSuccess = () => {
    reset();
    setValue('image', '');
    closeModal();
    addToast('Influencer atualizado com sucesso!');
  };

  async function submitForm(data: z.infer<typeof updateInfluencerSchema>) {
    setServerError(false);

    // delete empty fields
    for (const [key, value] of Object.entries(data)) {
      if (!value) delete data[key as keyof typeof data];
    }

    const formData = new FormData();

    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    // clone data and delete image field
    const jsonData = { ...data };
    delete jsonData.image;

    formData.append('data', JSON.stringify(jsonData));

    // check if any field is filled
    let isAnyFieldFilled = false;

    for (const value of Object.values(data)) {
      if (typeof value == 'object') {
        if (Object(value).length) {
          isAnyFieldFilled = true;
          break;
        }
      } else if (value && value !== '' && value !== 0) {
        isAnyFieldFilled = true;
        break;
      }
    }

    if (!isAnyFieldFilled) {
      setServerError('Preencha pelo menos um campo.');
      return;
    }

    try {
      const updatedInfluencer = await mutateAsync(formData);
      onSuccess();
      openModal('view-influencer', updatedInfluencer);
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

          if (
            data.message.includes(
              'Instagram already being used by another influencer',
            )
          ) {
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
              <Form.Control asChild>
                <select
                  {...register('niche')}
                  className="mb-1 inline-block w-full cursor-pointer appearance-none px-3 py-2 leading-normal hover:brightness-125"
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
              Atualizar Influencer
            </Form.Submit>

            {serverError && <p className="error-text">{serverError}</p>}
          </div>
        </div>
      </Form.Root>
    </FormProvider>
  );
});

UpdateInfluencerForm.displayName = 'UpdateInfluencerForm';
