'use client';

import influencerApi from '@/app/admin/api/influencerApi';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CaretDown,
  Crosshair,
  UserRectangle,
} from '@phosphor-icons/react/dist/ssr';
import * as Form from '@radix-ui/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { niches } from '../niches';
import brandApi from '@/app/admin/api/brandApi';
import { BrandRequest } from '@/types/brand';

export const registerBrandSchema = z.object({
  name: z
    .string()
    .min(1, 'É necessário informar um nome')
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(32, 'Nome muito longo'),
  description: z.string().max(400, 'Descrição muito longa').optional(),
  niche: z.string().min(1, 'Insira um nicho'),
});

export const RegisterBrandForm = forwardRef<HTMLFormElement>((props, ref) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (data: BrandRequest) => brandApi.createBrand(data),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  const [serverError, setServerError] = useState<boolean | string>(false);
  const { addToast } = useToast();
  const { closeModal } = useModal();

  const form = useForm<z.infer<typeof registerBrandSchema>>({
    resolver: zodResolver(registerBrandSchema),
    defaultValues: {
      name: 'Clube Atlético Mineiro',
      niche: niches[31],
      description: 'Lorem impmd, consectetur adipiscing elit.',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSuccess = () => {
    reset();
    closeModal();
    addToast('Marca cadastrada com sucesso!');
  };

  async function submitForm(data: z.infer<typeof registerBrandSchema>) {
    setServerError(false);

    try {
      const result = await mutateAsync(data);
      onSuccess();
    } catch (error) {
      // todo: handle errors
      setServerError('Erro inesperado, tente novamente.');
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
                placeholder="Nome da marca"
                autoComplete="off"
              />
            </Form.Control>
            {errors.name && (
              <Form.Message className="error-text">
                {errors.name.message}
              </Form.Message>
            )}
          </Form.Field>

          <Form.Field name="description" serverInvalid={!!errors.description}>
            <Form.Label className="mb-1 flex items-center gap-2">
              <UserRectangle className="size-5 opacity-80" /> Descrição
            </Form.Label>
            <Form.Control asChild>
              <input
                {...register('description')}
                className="mb-1 inline-block w-full appearance-none px-3 py-2 leading-none"
                type="text"
                placeholder="Uma breve descrição"
                autoComplete="off"
              />
            </Form.Control>
            {errors.description && (
              <Form.Message className="error-text">
                {errors.description.message}
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
          <Form.Submit
            className="mt-4 w-full rounded-sm bg-purple-600/60 px-4 py-2 shadow-sm duration-100 hover:brightness-110 disabled:opacity-60"
            disabled={isSubmitting}
          >
            Cadastrar marca
          </Form.Submit>

          {serverError && <p className="error-text">{serverError}</p>}
        </div>
      </Form.Root>
    </FormProvider>
  );
});

RegisterBrandForm.displayName = 'RegisterBrandForm';
