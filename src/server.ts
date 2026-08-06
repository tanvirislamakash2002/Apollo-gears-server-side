import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

let server = null as ReturnType<typeof app.listen> | null;
let shuttingDown = false;

const closeHttpServer = async () => {
  if (!server) return;

  return new Promise<void>((resolve) => {
    server?.close(() => {
      console.log('HTTP server closed');
      resolve();
    });
  });
};

const closeDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('Database connection closed');
  } catch (disconnectError) {
    console.error('Error while disconnecting database:', disconnectError);
  }
};

const shutdown = async (reason: string, error?: unknown) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.error(`Shutting down due to ${reason}`);
  if (error) {
    console.error(error instanceof Error ? error.stack ?? error.message : error);
  }

  const timeout = setTimeout(() => {
    console.error('Shutdown timeout reached, forcing exit');
    process.exit(1);
  }, 10000);

  await Promise.allSettled([closeHttpServer(), closeDatabase()]);
  clearTimeout(timeout);
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
