import { Prisma } from '../generated/prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

const handlePrismaValidationError = (
  err: Prisma.PrismaClientValidationError
): TGenericErrorResponse => {
  const statusCode = 400;
  const message = 'validation error';

  const full = err?.message || '';
  const lines = full
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Choose a specific line that likely contains the useful message.
  // Prefer the second line if the first is the generic "Invalid `...` invocation:" header.
  let specific = lines.length >= 2 && !lines[0].toLowerCase().startsWith('invalid') ? lines[0] : lines[1] || lines[0] || 'Validation failed';

  // Try to extract a field/path name from the message.
  let path: string | number = '';

  // Match backticked identifiers: `email`, `data.name`, etc.
  const backtickMatch = specific.match(/`([^`]+)`/);
  if (backtickMatch) {
    path = backtickMatch[1];
  } else {
    // Match common phrases like "Argument name" or "for field name"
    const argMatch = specific.match(/Argument\s+([a-zA-Z0-9_$.]+)/i);
    const forFieldMatch = specific.match(/for\s+(?:the\s+)?field\s+`?([a-zA-Z0-9_$.]+)`?/i);
    const propertyMatch = specific.match(/property\s+`?([a-zA-Z0-9_$.]+)`?/i);
    path = (argMatch && argMatch[1]) || (forFieldMatch && forFieldMatch[1]) || (propertyMatch && propertyMatch[1]) || '';
  }

  const errorSources: TErrorSources = [
    {
      path,
      message: specific,
    },
  ];

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaValidationError;
