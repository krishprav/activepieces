import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { emailOctopusAuth } from '../..';
import { emailOctopusProps } from '../common/props';
import { emailOctopusRequest } from '../common/request';

export const unsubscribeContact = createAction({
  auth: emailOctopusAuth,
  name: 'unsubscribe_contact',
  displayName: 'Unsubscribe Contact',
  description: 'Remove a contact from a list (unsubscribe).',
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
        method: HttpMethod.POST,
        path: `/lists/${listId}/contacts/${encodeURIComponent(email)}/unsubscribe`,
      }
    );
    return resp;
  },
});


