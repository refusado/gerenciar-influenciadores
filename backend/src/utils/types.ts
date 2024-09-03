import { JWT } from '@fastify/jwt';

// adding a "jwt" property type to the FastifyRequest so we can get the types
// for the JWT from the API request
declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
    influencer: { id: number; name: string; email: string };
  }

  export interface FastifyInstance {
    authenticate: any;
  }
}
