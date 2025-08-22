import { z } from 'zod';
import type { ISchemeProps } from '../types/api.interfaces';

export const urlScheme: z.ZodString = z
  .string()
  .regex(
    /^(?![a-zA-Z][a-zA-Z0-9+.-]*:\/\/)(?<host>(?:localhost|(?:\[[0-9a-fA-F:]+\])|(?:\d{1,3}(?:\.\d{1,3}){3})|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+)))(?::(?<port>\d{1,5}))?(?<rest>(?:[/?#][^\s]*)?)$/,
    'Invalid URL',
  );
export const urlProps: ISchemeProps = { scheme: urlScheme, hostType: 'URL' };
