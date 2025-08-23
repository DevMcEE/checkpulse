import type { IData, IMetaData } from '../types/api.interfaces';

interface PingResponseArgs {
  meta?: IMetaData;
  metaId?: number;
  data?: IData;
  dataCode?: number;
  dataType?: string;
  dataTimeouted?: boolean;
  dataTime?: number;
  dataMessage?: string;
}

export class PingResponse {
  meta: IMetaData;
  data: IData;
  pingedAt = new Date();

  constructor({
    meta,
    metaId,
    data,
    dataCode,
    dataType,
    dataTimeouted,
    dataTime,
    dataMessage,
  }: PingResponseArgs) {
    if (meta) this.meta = meta;
    else
      this.meta = {
        id: metaId || null,
      };
    if (data) this.data = data;
    else
      this.data = {
        code: dataCode || null,
        type: dataType || null,
        timeouted: dataTimeouted || false,
        time: dataTime || null,
        message: dataMessage || null,
      };
  }
}
