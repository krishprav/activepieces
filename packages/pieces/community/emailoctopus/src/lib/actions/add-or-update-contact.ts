import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { emailOctopusAuth } from '../..';
import { emailOctopusProps } from '../common/props';
import { emailOctopusRequest } from '../common/request';

export const addOrUpdateContact = createAction({
  auth: emailOctopusAuth,
  name: 'add_or_update_contact',
  displayName: 'Add / Update Contact',
  description: 'Adds a new contact to a list or updates an existing contact.',
  props: {
    listId: emailOctopusProps.listId,
    email: Property.ShortText({ displayName: 'Email', required: true }),
    firstName: Property.ShortText({ displayName: 'First Name', required: false }),
    lastName: Property.ShortText({ displayName: 'Last Name', required: false }),
    tags: Property.Array({ displayName: 'Tags', required: false }),
    fields: Property.Object({ displayName: 'Custom Fields', required: false }),
    status: Property.StaticDropdown({
      displayName: 'Status',
      required: false,
      options: {
        options: [
          { label: 'Subscribed', value: 'SUBSCRIBED' },
          { label: 'Unsubscribed', value: 'UNSUBSCRIBED' },
        ],
        disabled: false,
      },
    }),
  },
  async run(context) {
    const { auth, propsValue } = context;
    const { listId, email, firstName, lastName, tags, fields, status } = propsValue;

    const payload: Record<string, unknown> = {
      email_address: email,
      fields: fields ?? {},
    };
    if (firstName) (payload['fields'] as any)["FirstName"] = firstName;
    if (lastName) (payload['fields'] as any)["LastName"] = lastName;
    if (tags && Array.isArray(tags)) payload["tags"] = tags;
    if (status) payload["status"] = status;

    const resp = await emailOctopusRequest<{ id: string } | { email_address: string }>(
      {
        auth,
        method: HttpMethod.POST,
        path: `/lists/${listId}/contacts`,
        body: payload,
      }
    );
    return resp;
  },
});


