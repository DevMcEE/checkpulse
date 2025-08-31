import z from 'zod';

export const responseCodeSchema = z
  .number()
  .int()
  .refine((val) => val >= 100 && val < 600, {
    message: 'Must be a valid HTTP status code (100-599)',
  });
