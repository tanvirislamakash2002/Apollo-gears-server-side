import { Prisma } from '../generated/prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

const handlePrismaKnownRequestError = (
  err: Prisma.PrismaClientKnownRequestError
): TGenericErrorResponse => {
  let statusCode = 400;
  let message = 'Prisma Client Known Request Error';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: err.message,
    },
  ];

  if (err.code === 'P2002') {
    const target = (err.meta?.target as string[]) || [];
    statusCode = 400;
    message = 'Duplicate Field Value Entered';
    errorSources = [
      {
        path: target.join(', '),
        message: `${target.join(', ')} already exists`,
      },
    ];
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = (err.meta?.cause as string) || 'Record not found!';
    errorSources = [
      {
        path: '',
        message,
      },
    ];
  } else if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Foreign key constraint failed on the field';
    errorSources = [
      {
        path: (err.meta?.field_name as string) || '',
        message: 'Invalid foreign key reference',
      },
    ];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaKnownRequestError;
