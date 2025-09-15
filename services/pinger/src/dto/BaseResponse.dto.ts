export abstract class BaseResponseDto<
  M = Record<string, unknown>,
  D = unknown,
> {
  meta?: M;
  data?: D;

  constructor(meta?: M, data?: D) {
    this.meta = meta;
    this.data = data;
  }
}
