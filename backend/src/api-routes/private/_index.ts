import { FastifyInstance } from 'fastify';
import { brandRoutes } from './brand';
import { influencerRoutes } from './influencer';
import { influencerBrandLinkRoutes } from './influencer-brand';

export async function privateRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate);

  app.register(influencerRoutes);
  app.register(brandRoutes);
  app.register(influencerBrandLinkRoutes);
}
