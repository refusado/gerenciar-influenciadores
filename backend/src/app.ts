import fastifyCookie from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { apiRoutes } from './api-routes';
import env from './utils/env';
import { viewRoutes } from './view-routes';

export const app = fastify();

app.register(fastifyCors, {
  origin: env.NODE_ENV === 'development' ? 'http://localhost:3000' : '*',
  credentials: true,
});

app.register(fastifyCookie, { secret: 'secret' });
app.register(fastifyJwt, { secret: env.JWT_SECRET });

app.addHook('preHandler', (request, _, next) => {
  request.jwt = app.jwt;
  next();
});

app.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.access_token;

    if (!token) {
      if (request.url.startsWith('/api')) {
        return reply.status(401).send({ message: 'unauthorized' });
      } else {
        return reply.redirect('/login?message=unauthorized');
      }
    }

    const loggedAdmin = app.jwt.verify<{
      id: number;
      name: string;
      email: string;
    }>(token);

    if (!loggedAdmin) {
      if (request.url.startsWith('/api')) {
        return reply.status(401).send({ message: 'invalid token' });
      } else {
        return reply.redirect('/login?message=invalid_token');
      }
    }

    request.user = loggedAdmin;
  }
);

app.register(viewRoutes);
app.register(apiRoutes, { prefix: '/api' });
