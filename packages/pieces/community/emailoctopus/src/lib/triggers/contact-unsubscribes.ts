import { DedupeStrategy, Polling, pollingHelper, HttpMethod } from '@activepieces/pieces-common';
import { createTrigger, TriggerStrategy } from '@activepieces/pieces-framework';
import dayjs from 'dayjs';
import { emailOctopusAuth } from '../..';
import { emailOctopusProps } from '../common/props';
import { emailOctopusRequest } from '../common/request';

type Contact = {
  email_address?: string;
  status?: string;
  updated_at?: string;
};

const polling: Polling<any, any> = {
  strategy: DedupeStrategy.TIMEBASED,
  items: async ({ auth, propsValue }) => {
    const { listId } = propsValue as { listId: string };
    const resp = await emailOctopusRequest<{ data: Contact[] }>({
      auth,
      method: HttpMethod.GET,
      path: `/lists/${listId}/contacts`,
      query: { limit: 100, status: 'UNSUBSCRIBED', sort: 'updated_at_desc' },
    });
    const items = (resp.data || []);
    return items.map((c) => ({
      epochMilliSeconds: dayjs(c.updated_at ?? Date.now()).valueOf(),
      data: c,
    }));
  },
};

export const eoContactUnsubscribes = createTrigger({
  auth: emailOctopusAuth,
  name: 'emailoctopus_contact_unsubscribes',
  displayName: 'Contact Unsubscribes',
  description: 'Fires when a contact unsubscribes from a list.',
  props: {
    listId: emailOctopusProps.listId,
  },
  type: TriggerStrategy.POLLING,
  sampleData: {
    email_address: 'test@example.com',
    status: 'UNSUBSCRIBED',
  },
  async test(context) {
    return pollingHelper.test(polling, context);
  },
  async onEnable(context) {
    const { store, auth, propsValue } = context;
    await pollingHelper.onEnable(polling, { store, auth, propsValue });
  },
  async onDisable(context) {
    const { store, auth, propsValue } = context;
    await pollingHelper.onDisable(polling, { store, auth, propsValue });
  },
  async run(context) {
    return pollingHelper.poll(polling, context);
  },
});


