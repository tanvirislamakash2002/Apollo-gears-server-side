import { Prisma } from '../generated/prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

const handlePrismaValidationError = (
  err: Prisma.PrismaClientValidationError
): TGenericErrorResponse => {
  const statusCode = 400;
  const message = 'Prisma Validation Error';
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

export default handlePrismaValidationError;
