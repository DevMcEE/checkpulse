import z from 'zod';
import { Levels } from '../../types/ping-setup.types';

export const levelScheme = z.enum(Levels);
