import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

let server = null as ReturnType<typeof app.listen> | null;

const shutdown = async (reason: string, error?: unknown) => {
  console.error(`Shutting down due to ${reason}`);
  if (error) {
    console.error(error instanceof Error ? error.stack ?? error.message : error);
  }

  if (server) {
    await new Promise<void>((resolve) => {
      server?.close(() => {
        console.log('HTTP server closed');
        resolve();
      });
    });
  }

  try {
    await prisma.$disconnect();
    console.log('Database connection closed');
  } catch (disconnectError) {
    console.error('Error while disconnecting database:', disconnectError);
  }

  process.exit(error ? 1 : 0);
};

process.on('uncaughtException', (error) => shutdown('uncaughtException', error));
process.on('unhandledRejection', (reason) => shutdown('unhandledRejection', reason));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    await shutdown('startup error', err);
  }
}

main();
