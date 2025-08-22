import type z from 'zod';
import type { HostType } from './host.types';

export interface IMetaData {
  id: number | null;
}

export interface IData {
  code: number | null;
  type: string | null;
  timeouted: boolean | null;
  time: number | null;
  message: string | null;
}

export interface IResponse {
  meta: IMetaData;
  data: IData;
}

export interface ISchemeProps {
  scheme: z.ZodString;
  hostType: HostType;
}
