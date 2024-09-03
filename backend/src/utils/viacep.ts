import axios, { AxiosResponse } from 'axios';
import z from 'zod';

// viacep result when cep is found
export const succesAddressSchema = z.object({
  cep: z.string().length(9),
  logradouro: z.string(),
  complemento: z.string(),
  unidade: z.string(),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.string(),
  estado: z.string(),
  regiao: z.string(),
  ibge: z.string(),
  gia: z.string(),
  ddd: z.string(),
  siafi: z.string(),
});

// viacep result when cep is not found
export const notFoundAddressSchema = z.object({
  erro: z.enum(['true']),
});

export const axiosResponseSchema = z.union([
  succesAddressSchema,
  notFoundAddressSchema,
]);

type ViacepResponseType = AxiosResponse<z.infer<typeof axiosResponseSchema>>;

export const cepValidationSchema = z.string().length(8).regex(/^\d+$/, {
  message: 'CEP must contain only numbers',
});

type Address =
  | {
      error: 'notFound' | 'invalidFormat' | 'unknown';
    }
  | {
      data: z.infer<typeof succesAddressSchema>;
    };

export async function getAddressByCep(cep: string): Promise<Address> {
  try {
    if (!cepValidationSchema.safeParse(cep).success) {
      return { error: 'invalidFormat' };
    }

    const response: ViacepResponseType = await axios.get(
      `https://viacep.com.br/ws/${cep}/json/`
    );

    if ('erro' in response.data) {
      return { error: 'notFound' };
    }

    return { data: response.data };
  } catch (error) {
    console.log('VIACEP error: ', error);
    return { error: 'unknown' };
  }
}
