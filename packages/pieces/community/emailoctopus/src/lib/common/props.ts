import { OAuth2PropertyValue, Property, SecretTextProperty } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { emailOctopusRequest } from './request';

export const emailOctopusProps = {
  listId: Property.Dropdown<string>({
    displayName: 'List',
    description: 'Select an EmailOctopus list',
    required: true,
    refreshers: ['auth'],
      options: async (propsValue: any) => {
      const auth = propsValue.auth;
      if (!auth) {
        return {
          disabled: true,
          options: [],
          placeholder: 'Please connect EmailOctopus',
        };
      }

        const apiKey = auth as SecretTextProperty<true>;
      const resp = await emailOctopusRequest<{ data: Array<{ id: string; name: string }> }>(
        {
          auth: apiKey,
          method: HttpMethod.GET,
          path: `/lists`,
        }
      );
      const options = (resp.data || []).map((l) => ({ label: l.name, value: l.id }));
      return { disabled: false, options };
    },
  }),

  campaignId: Property.ShortText({
    displayName: 'Campaign ID',
    description: 'Campaign identifier (for opens/clicks/bounces triggers)',
    required: true,
  }),
};