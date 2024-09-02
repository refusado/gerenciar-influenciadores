import { app } from './app';
import env from './utils/env';

app.listen({ port: env.PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server is running on port ${env.PORT}.`);
  // console.log(`URL: ${env.BASE_URL}`);
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
