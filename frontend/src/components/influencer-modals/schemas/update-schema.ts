import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const updateInfluencerSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(32, 'Nome muito longo')
    .optional()
    .or(z.literal('').optional()),
  instagram: z
    .string()
    .min(3, 'Instagram muito curto')
    .max(32, 'Instagram muito longo')
    .optional()
    .or(z.literal('').optional()),
  niche: z.string().optional().or(z.literal('')),
  reach: z
    .number({
      invalid_type_error: 'Número inválido',
    })
    .min(1, 'Número inválido')
    .optional()
    .or(z.nan().optional()),
  cep: z
    .string()
    .length(8, 'O CEP deve ter 8 caracteres')
    .regex(/^\d+$/, 'Envie apenas números')
    .optional()
    .or(z.literal('').optional()),
  image: z
    .any()
    .optional()
    .refine(
      (file) =>
        file.length === 1
          ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
            ? true
            : false
          : true,
      'A imagem deve ser do tipo jpeg, jpg, png ou webp.',
    )
    .refine(
      (file) =>
        file.length === 1
          ? file[0]?.size <= MAX_FILE_SIZE
            ? true
            : false
          : true,
      'A imagem deve ter no máximo 5 MB.',
    ),
});
