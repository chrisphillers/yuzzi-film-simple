import type { CollectionConfig, BeforeChangeHook } from 'payload/types';
import type { PayloadRequest } from 'payload/types';
import { addSubscriberToMailchimp } from '../hooks/mailchimp'; // Import the Mailchimp hook

interface SubscriberData {
  email: string;
  source?: string;
}

interface BeforeChangeHookArgs {
  data: SubscriberData;
  req: PayloadRequest;
  operation: 'create' | 'update' | 'delete';
}

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    description: 'A collection for newsletter subscribers.',
  },
  access: {
    // Allow anyone to create a subscriber (submit the form)
    create: () => true,
    // Restrict reading, updating, and deleting to admin users
    read: ({ req }: { req: PayloadRequest }) => req.user?.collection === 'users',
    update: ({ req }: { req: PayloadRequest }) => req.user?.collection === 'users',
    delete: ({ req }: { req: PayloadRequest }) => req.user?.collection === 'users',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      unique: true, // Ensure no duplicate email addresses
      admin: {
        readOnly: true, // Prevent editing email in the admin UI after creation
      },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Source',
      admin: {
        position: 'sidebar',
        description: 'Where the subscription originated from (e.g., "website-newsletter").',
      },
      defaultValue: 'website-newsletter',
    },
  ],
  hooks: {
    beforeChange: [
      (async ({ data, req, operation }: BeforeChangeHookArgs) => {
        // Only trigger Mailchimp API call for new subscribers (when creating)
        if (operation === 'create') {
          const success = await addSubscriberToMailchimp(data.email, req.payload);
          if (!success) {
            throw new Error('Failed to add subscriber to Mailchimp.');
          }
        }
        return data;
      }) as BeforeChangeHook,
    ],
  },
};
