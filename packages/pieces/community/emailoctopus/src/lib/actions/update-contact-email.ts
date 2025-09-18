import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { emailOctopusAuth } from '../..';
import { emailOctopusProps } from '../common/props';
import { emailOctopusRequest } from '../common/request';

export const updateContactEmail = createAction({
  auth: emailOctopusAuth,
  name: 'update_contact_email',
  displayName: "Update Contact's Email Address",
  description: "Change a contact's email address in a list.",
  props: {
    listId: emailOctopusProps.listId,
    currentEmail: Property.ShortText({ displayName: 'Current Email', required: true }),
    newEmail: Property.ShortText({ displayName: 'New Email', required: true }),
  },
  async run(context) {
    const { auth, propsValue } = context;
    const { listId, currentEmail, newEmail } = propsValue;

    const resp = await emailOctopusRequest(
      {
        auth,
        method: HttpMethod.PATCH,
        path: `/lists/${listId}/contacts/${encodeURIComponent(currentEmail)}`,
        body: { email_address: newEmail },
      }
    );
    return resp;
  },
});


