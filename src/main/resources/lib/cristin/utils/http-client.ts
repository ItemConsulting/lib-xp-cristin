import { type HttpResponse } from "/lib/http-client";

export function parseResponse<T>({ res, errorMessage }: ParseResponseParams): T {
  if (res.status === 200 && res.body) {
    return JSON.parse(res.body);
  } else {
    log.warning(JSON.stringify(res.headers));
    if (res.body) {
      log.warning(res.body);
    }
    log.error(`${errorMessage}, status: ${res.status}`);

    throw new Error(errorMessage);
  }
}

export interface ParseResponseParams {
  res: HttpResponse;
  errorMessage: string;
}
