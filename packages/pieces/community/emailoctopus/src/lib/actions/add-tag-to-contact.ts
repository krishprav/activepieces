import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { emailOctopusAuth } from '../..';
import { emailOctopusProps } from '../common/props';
import { emailOctopusRequest } from '../common/request';

export const addTagToContact = createAction({
  auth: emailOctopusAuth,
  name: 'add_tag_to_contact',
  displayName: 'Add Tag to Contact',
  description: 'Add one or more tags to a contact in a specified list.',
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
        method: HttpMethod.POST,
        path: `/lists/${listId}/contacts/${encodeURIComponent(email)}/tags`,
        body: { tags },
      }
    );
    return resp;
  },
});


