import fastifyStatic from '@fastify/static';
import { FastifyInstance } from 'fastify';
import path from 'path';
import env from '@/env';

// handling with html pages generated by nextjs in "out" directory
export async function viewRoutes(app: FastifyInstance) {
  const clientRoot = path.resolve(__dirname, '../../frontend/out');

  app.register(fastifyStatic, {
    root: clientRoot,
    prefix: '/',
  });

  // for admin routes we need to check if the client is logged in
  app.get('/admin', async (request, reply) => {
    const token = request.cookies.access_token;

    if (!token) return reply.redirect('/?auth=failed');

    return reply.sendFile('admin.html', clientRoot);
  });

  // this redirect to the spa if the route is not found
  // obs.: once nextjs makes the routing system in the client side, all spa
  // pages will not be found with direct requests, so for spa routes we also make
  // this redirect to the base url. I'm sending the requested path in params so
  // we can handle the routing logic normally in the client side
  app.setNotFoundHandler(async (request, reply) => {
    return reply.redirect(`${env.BASE_URL}/?redirect=${request.url}`);
  });
}
