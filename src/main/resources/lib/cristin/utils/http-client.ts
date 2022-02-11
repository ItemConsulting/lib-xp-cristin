import { type HttpResponse } from "/lib/http-client";

export function parseResponse<T>({ res, errorMessage }: ParseResponseParams): T {
  if (res.status === 200 && res.body) {
    return JSON.parse(res.body);
  } else {
    log.error(`${errorMessage}, status: ${res.status}`);
    log.error(res.body);
    throw new Error(errorMessage);
  }
}

export interface ParseResponseParams {
  res: HttpResponse;
  errorMessage: string;
}
