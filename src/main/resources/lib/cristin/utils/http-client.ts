import { type HttpResponse } from "/lib/http-client";

export function parseResponse<T>({ res, errorMessage, url }: ParseResponseParams): T {
  if (res.status === 200 && res.body) {
    return JSON.parse(res.body);
  } else {
    const message = `${errorMessage}, status: ${res.status}, url: ${url}`;
    log.warning(JSON.stringify(res.headers));
    if (res.body) {
      log.warning(res.body);
    }
    log.error(message);

    throw new Error(message);
  }
}

export interface ParseResponseParams {
  res: HttpResponse;
  errorMessage: string;
  url: string;
}
