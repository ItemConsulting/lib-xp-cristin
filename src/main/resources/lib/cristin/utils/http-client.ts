import { type HttpResponse } from "/lib/http-client";

export function parseResponse<T>({ res, errorMessage, url }: ParseResponseParams): T {
  if (res.status === 200 && res.body) {
    return JSON.parse(res.body);
  } else if (res.status !== 404) {
    log.warning(JSON.stringify(res.headers));
    if (res.body) {
      log.warning(res.body);
    }
  }

  throw new Error(`${errorMessage}, status: ${res.status}, url: ${url}`);
}

export interface ParseResponseParams {
  res: HttpResponse;
  errorMessage: string;
  url: string;
}
