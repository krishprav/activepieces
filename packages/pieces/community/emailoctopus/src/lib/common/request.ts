import { HttpMethod, httpClient, HttpRequest } from '@activepieces/pieces-common';
import { SecretTextProperty } from '@activepieces/pieces-framework';
import { buildBaseUrl } from './constants';

type QueryParams = Record<string, string | number | boolean | undefined>;

export const emailOctopusRequest = async <T = unknown>({
  auth,
  method,
  path,
  body,
  query,
}: {
  auth: SecretTextProperty<true> | string;
  method: HttpMethod;
  path: string;
  body?: unknown;
  query?: QueryParams;
}): Promise<T> => {
  const apiKey = typeof auth === 'string' ? auth : (auth as SecretTextProperty<true>);

  const url = new URL(`${buildBaseUrl()}${path}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }

  const request: HttpRequest = {
    method,
    url: url.toString(),
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': String(apiKey),
    },
    body,
  };

  const response = await httpClient.sendRequest<T>(request);
  return response.body as T;
};


