import fastifyCookie from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { apiRoutes } from './api-routes';
import env from './env';
import { viewRoutes } from './view-handler';

export const app = fastify();

app.register(fastifyCors, {
  // credentials are not supported for origin '*', so in development we specify
  // the front end URL directly once the web app is running in different server
  origin: env.NODE_ENV === 'development' ? 'http://localhost:3000' : '*',
  credentials: true,
});

app.register(fastifyCookie, { secret: 'secret' });
app.register(fastifyJwt, { secret: env.JWT_SECRET });
app.addHook('preHandler', (request, _, next) => {
  request.jwt = app.jwt;
  next();
});

app.register(viewRoutes);
app.register(apiRoutes, { prefix: '/api' });
