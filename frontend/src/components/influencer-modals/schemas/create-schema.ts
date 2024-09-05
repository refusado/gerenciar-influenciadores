import { z } from 'zod';

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
    .length(8, 'O CEP deve ter 8 caracteres')
    .regex(/^\d+$/, 'Envie apenas números'),
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
