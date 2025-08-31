import z from 'zod';
import { responseCodeSchema } from '../http-status.schema';
import { ipv4Scheme } from '../ip.scheme';
import { urlScheme } from '../url.scheme';
import { notificationChannelsScheme } from './notificationsChannels.scheme';

export const pingSetupBodyScheme = z.object({
  resource: z.union([ipv4Scheme, urlScheme]),
  timeout: z.number(),
  responseCode: responseCodeSchema,
  contentType: z.string().nullable(),
  startTime: z.coerce.date(),
  period: z.number(),
  incedentThreshold: z.number(),
  recoveryThreshold: z.number(),
  notificationChannels: z.array(notificationChannelsScheme).nullable(),
});
