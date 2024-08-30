import { fastifyCors } from '@fastify/cors';
import fastify from 'fastify';
import env from './env';
import { apiRoutes } from './routes';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

const app = fastify();

app.register(fastifyCors, { origin: '*' });

app.register(fastifyJwt, { secret: env.JWT_SECRET });
app.addHook('preHandler', (request, _, next) => {
  request.jwt = app.jwt;
  next();
});

app.register(fastifyCookie, { secret: 'secret' });

app.register(apiRoutes, { prefix: '/api' });

app.listen({ port: env.PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server is running on port ${env.PORT}.`);
  console.log(`URL: ${env.API_BASE_URL}`);
});

const gracefullyShutdown = async () => {
  console.log('gracefully shutting down...');
  try {
    await app.close();
    console.log('server successfully closed.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    console.log('failed to close server.');
    process.exit(1);
  }
};

process.on('SIGINT', gracefullyShutdown);
process.on('SIGTERM', gracefullyShutdown);
