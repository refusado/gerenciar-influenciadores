import fastifyCookie from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import { apiRoutes } from './api-routes';
import { swaggerDocs } from './docs';
import env from './utils/env';
import { viewRoutes } from './view-routes';

export const app = fastify();

app.register(fastifyCors, {
  origin: env.NODE_ENV === 'development' ? 'http://localhost:3000' : '*',
  credentials: true,
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fieldNameSize: 100,
  },
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

    let loggedAdmin;

    try {
      loggedAdmin = app.jwt.verify<{
        id: number;
        name: string;
        email: string;
      }>(token);
    } catch (error) {
      if (env.NODE_ENV === 'development') {
        console.log(error);
      }

      if (request.url.startsWith('/api')) {
        return reply.status(401).send({ message: 'invalid token' });
      } else {
        return reply.redirect('/login?message=unauthorized');
      }
    }

    request.user = loggedAdmin;
  }
);

swaggerDocs(app); // this generates docs for everything

app.register(viewRoutes);
app.register(apiRoutes, { prefix: '/api' });

// serve uploaded images from uploads/images to a /img/ route
app.register(fastifyStatic, {
  root: path.join(__dirname, '../uploads/images'),
  prefix: '/img/',
});
