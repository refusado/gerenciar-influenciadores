import { FastifyInstance } from 'fastify';
import { loginAdmin } from './login';
import { logoutAdmin } from './logout';
import { signupAdmin } from './signup';

export async function authRoutes(app: FastifyInstance) {
  app.register(signupAdmin);
  app.register(loginAdmin);
  app.register(logoutAdmin);
}
