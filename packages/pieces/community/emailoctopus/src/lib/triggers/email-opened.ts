import { DedupeStrategy, Polling, pollingHelper, HttpMethod } from '@activepieces/pieces-common';
import { createTrigger, TriggerStrategy } from '@activepieces/pieces-framework';
import dayjs from 'dayjs';
import { emailOctopusAuth } from '../..';
import { emailOctopusProps } from '../common/props';
import { emailOctopusRequest } from '../common/request';

type OpenEvent = {
  email_address?: string;
  occurred_at?: string;
  [k: string]: unknown;
};

const polling: Polling<any, any> = {
  strategy: DedupeStrategy.TIMEBASED,
  items: async ({ auth, propsValue }) => {
    const { campaignId } = propsValue as { campaignId: string };
    const resp = await emailOctopusRequest<{ data: OpenEvent[] }>({
      auth,
      method: HttpMethod.GET,
      path: `/campaigns/${campaignId}/events/opens`,
      query: { limit: 100, sort: 'occurred_at_desc' },
    });
    const items = (resp.data || []);
    return items.map((e) => ({
      epochMilliSeconds: dayjs(e.occurred_at ?? Date.now()).valueOf(),
      data: e,
    }));
  },
};

export const eoEmailOpened = createTrigger({
  auth: emailOctopusAuth,
  name: 'emailoctopus_email_opened',
  displayName: 'Email Opened',
  description: 'Fires when a recipient opens an email from a specified campaign.',
  props: {
    campaignId: emailOctopusProps.campaignId,
  },
  type: TriggerStrategy.POLLING,
  sampleData: {
    email_address: 'test@example.com',
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


