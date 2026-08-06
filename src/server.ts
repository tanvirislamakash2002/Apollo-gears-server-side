import app from './app';
import config from './config';

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

  process.exit(error ? 1 : 0);
};

process.on('uncaughtException', (error) => shutdown('uncaughtException', error));
process.on('unhandledRejection', (reason) => shutdown('unhandledRejection', reason));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

async function main() {
  try {
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    await shutdown('startup error', err);
  }
}

main();
