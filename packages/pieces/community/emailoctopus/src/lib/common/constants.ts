export const EMAIL_OCTOPUS_BASE_URL = 'https://api.emailoctopus.com';
export const EMAIL_OCTOPUS_API_PREFIX = '/v2';

export const buildBaseUrl = (): string =>
  `${EMAIL_OCTOPUS_BASE_URL}${EMAIL_OCTOPUS_API_PREFIX}`;


