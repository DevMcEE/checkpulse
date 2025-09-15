import type { IData, IMetaData } from '../types/api.types';
import { BaseResponseDto } from './BaseResponse.dto';

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

export class PingResponseDto extends BaseResponseDto<IMetaData, IData> {
  pingedAt: Date;

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
    const finalMeta: IMetaData = meta ?? { id: metaId || null };

    const finalData: IData = data ?? {
      code: dataCode || null,
      type: dataType || null,
      timeouted: dataTimeouted || false,
      time: dataTime || null,
      message: dataMessage || null,
    };

    super(finalMeta, finalData);
    this.pingedAt = new Date();
  }
}
