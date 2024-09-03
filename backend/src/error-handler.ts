import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import env from './utils/env';

// abstracting error handler to handle request data type erros (throwed by zod)
export default ((error, _, reply) => {
  if (env.NODE_ENV === 'development') {
    console.log(error);
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Data sent is not in a valid format.',
      error: error.flatten(),
    });
  }

  // uncaught errors
  return reply.status(500).send({ message: 'Internal server error' });
}) satisfies FastifyInstance['errorHandler'];
