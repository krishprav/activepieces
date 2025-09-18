import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { HttpMethod } from '@activepieces/pieces-common';
import { addOrUpdateContact } from './lib/actions/add-or-update-contact';
import { unsubscribeContact } from './lib/actions/unsubscribe-contact';
import { findContact } from './lib/actions/find-contact';
import { updateContactEmail } from './lib/actions/update-contact-email';
import { addTagToContact } from './lib/actions/add-tag-to-contact';
import { removeTagFromContact } from './lib/actions/remove-tag-from-contact';
import { createList } from './lib/actions/create-list';
import { eoNewContact } from './lib/triggers/new-contact';
import { eoContactUnsubscribes } from './lib/triggers/contact-unsubscribes';
import { eoEmailOpened } from './lib/triggers/email-opened';
import { eoEmailClicked } from './lib/triggers/email-clicked';
import { eoEmailBounced } from './lib/triggers/email-bounced';

export const emailOctopusAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'Enter your EmailOctopus API key. You can find this in your EmailOctopus account settings.',
  validate: async ({ auth }) => {
    try {
      const { emailOctopusRequest } = await import('./lib/common/request');
      await emailOctopusRequest({
        auth: auth as any,
        method: HttpMethod.GET,
        path: '/lists',
      });
      return { valid: true };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid API key. Please check your EmailOctopus API key.',
      };
    }
  },
});

export const emailoctopus = createPiece({
  displayName: 'EmailOctopus',
  description: 'Email marketing platform focusing on list management, campaign sending, tagging & unsubscribes.',
  logoUrl: 'https://emailoctopus.com/assets/img/logo/emailoctopus-logo.svg',
  authors: ['activepieces-ai'],
  categories: [PieceCategory.MARKETING],
  minimumSupportedRelease: '0.30.0',
  auth: emailOctopusAuth,
  actions: [
    addOrUpdateContact,
    unsubscribeContact,
    findContact,
    updateContactEmail,
    addTagToContact,
    removeTagFromContact,
    createList,
  ],
  triggers: [
    eoNewContact,
    eoContactUnsubscribes,
    eoEmailOpened,
    eoEmailClicked,
    eoEmailBounced,
  ],
});


