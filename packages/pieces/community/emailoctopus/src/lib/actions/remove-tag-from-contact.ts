import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { emailOctopusAuth } from '../..';
import { emailOctopusProps } from '../common/props';
import { emailOctopusRequest } from '../common/request';

export const removeTagFromContact = createAction({
  auth: emailOctopusAuth,
  name: 'remove_tag_from_contact',
  displayName: 'Remove Tag from Contact',
  description: 'Remove tag(s) from a contact in a list.',
  props: {
    listId: emailOctopusProps.listId,
    email: Property.ShortText({ displayName: 'Email', required: true }),
    tags: Property.Array({ displayName: 'Tags', required: true }),
  },
  async run(context) {
    const { auth, propsValue } = context;
    const { listId, email, tags } = propsValue as { listId: string; email: string; tags: string[] };

    const resp = await emailOctopusRequest(
      {
        auth,
        method: HttpMethod.DELETE,
        path: `/lists/${listId}/contacts/${encodeURIComponent(email)}/tags`,
        body: { tags },
      }
    );
    return resp;
  },
});


