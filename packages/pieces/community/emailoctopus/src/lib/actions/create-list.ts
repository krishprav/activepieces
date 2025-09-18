import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod } from '@activepieces/pieces-common';
import { emailOctopusAuth } from '../..';
import { emailOctopusRequest } from '../common/request';

export const createList = createAction({
  auth: emailOctopusAuth,
  name: 'create_list',
  displayName: 'Create List',
  description: 'Creates a new list.',
  props: {
    name: Property.ShortText({ displayName: 'Name', required: true }),
  },
  async run(context) {
    const { auth, propsValue } = context;
    const { name } = propsValue;

    const resp = await emailOctopusRequest(
      {
        auth,
        method: HttpMethod.POST,
        path: `/lists`,
        body: { name },
      }
    );
    return resp;
  },
});


