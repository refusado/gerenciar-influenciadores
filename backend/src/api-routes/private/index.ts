import { FastifyInstance } from 'fastify';
import { brandRoutes } from './brand';
import { influencerBrandLinkRoutes } from './influencer-brand';
import { influencerRoutes } from './influencer/routes';

export async function privateRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate);

  app.register(influencerRoutes);
  app.register(brandRoutes);
  app.register(influencerBrandLinkRoutes);
}
