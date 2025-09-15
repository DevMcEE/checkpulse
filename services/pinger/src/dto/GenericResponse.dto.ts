import { BaseResponseDto } from './BaseResponse.dto';

export class GenericResponseDto<
  M = Record<string, unknown>,
  D = unknown,
> extends BaseResponseDto<M, D> {
  constructor(meta?: M, data?: D) {
    super(meta, data);
  }
}
