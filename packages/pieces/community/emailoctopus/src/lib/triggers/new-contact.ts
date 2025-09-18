import { DedupeStrategy, Polling, pollingHelper, HttpMethod } from '@activepieces/pieces-common';
import { createTrigger, TriggerStrategy } from '@activepieces/pieces-framework';
import dayjs from 'dayjs';
import { emailOctopusAuth } from '../..';
import { emailOctopusProps } from '../common/props';
import { emailOctopusRequest } from '../common/request';

type Contact = {
  id?: string;
  email_address?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [k: string]: unknown;
};

const polling: Polling<any, any> = {
  strategy: DedupeStrategy.TIMEBASED,
  items: async ({ auth, propsValue }) => {
    const { listId } = propsValue as { listId: string };
    const resp = await emailOctopusRequest<{ data: Contact[] }>({
      auth,
      method: HttpMethod.GET,
      path: `/lists/${listId}/contacts`,
      query: { limit: 100, sort: 'created_at_desc' },
    });
    const items = (resp.data || []);
    return items.map((c) => ({
      epochMilliSeconds: dayjs(c.created_at ?? c.updated_at ?? Date.now()).valueOf(),
      data: c,
    }));
  },
};

export const eoNewContact = createTrigger({
  auth: emailOctopusAuth,
  name: 'emailoctopus_new_contact',
  displayName: 'New Contact',
  description: 'Fires when a new contact is added to a particular list.',
  props: {
    listId: emailOctopusProps.listId,
  },
  type: TriggerStrategy.POLLING,
  sampleData: {
    email_address: 'test@example.com',
    status: 'SUBSCRIBED',
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


