import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { emailOctopusAuth } from '../..';
import { emailOctopusProps } from '../common/props';
import { emailOctopusRequest } from '../common/request';

export const findContact = createAction({
  auth: emailOctopusAuth,
  name: 'find_contact',
  displayName: 'Find Contact',
  description: 'Look up a contact by email address within a given list.',
  props: {
    listId: emailOctopusProps.listId,
    email: Property.ShortText({ displayName: 'Email', required: true }),
  },
  async run(context) {
    const { auth, propsValue } = context;
    const { listId, email } = propsValue;

    const resp = await emailOctopusRequest(
      {
        auth,
        method: HttpMethod.GET,
        path: `/lists/${listId}/contacts/${encodeURIComponent(email)}`,
      }
    );
    return resp;
  },
});


