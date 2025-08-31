import z from 'zod';
import { HostTypes } from '../types/host.types';

export const hostTypeScheme = z.enum(HostTypes);
