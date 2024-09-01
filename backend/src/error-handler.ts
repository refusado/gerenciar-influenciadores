import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

// abstracting error handler to handle request data type erros (throwed by zod)
export default ((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Data sent is not in a valid format.',
      error: error.flatten().fieldErrors,
    });
  }

  // uncaught errors
  return reply.status(500).send({ message: 'Internal server error' });
}) satisfies FastifyInstance['errorHandler'];
