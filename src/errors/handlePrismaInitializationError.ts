import { Prisma } from '../generated/prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

const handlePrismaInitializationError = (
  err: Prisma.PrismaClientInitializationError
): TGenericErrorResponse => {
  const statusCode = 500;
  const message = 'Prisma Client Initialization Error';
  const errorSources: TErrorSources = [
    {
      path: '',
      message: err.message,
    },
  ];

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaInitializationError;
