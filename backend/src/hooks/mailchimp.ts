import mailchimp from '@mailchimp/mailchimp_marketing';
import { Payload } from 'payload';

// Initialize Mailchimp client
mailchimp.setConfig({
  apiKey: process.env.YUZZI_MAILCHIMP_API_KEY || '',
  server: process.env.YUZZI_MAILCHIMP_SERVER_PREFIX || '',
});

// Function to add a subscriber to Mailchimp
export const addSubscriberToMailchimp = async (
  email: string,
  payload: Payload
): Promise<boolean> => {
  try {
    const listId = process.env.YUZZI_MAILCHIMP_LIST_ID;
    if (!listId) {
      throw new Error('YUZZI_MAILCHIMP_LIST_ID is not defined');
    }

    // Send confirmation email
    await payload.sendEmail({
      to: email,
      subject: 'Confirm your subscription to Le Yuzzi',
      html: `
        <h1>Welcome to Le Yuzzi!</h1>
        <p>Thank you for subscribing to our newsletter. Please confirm your subscription by clicking the link below:</p>
        <p><a href="${process.env.YUZZI_FRONTEND_URL}/confirm-subscription?email=${encodeURIComponent(email)}">Confirm Subscription</a></p>
      `,
      text: `
        Welcome to Le Yuzzi!
        
        Thank you for subscribing to our newsletter. Please confirm your subscription by clicking the link below:
        
        ${process.env.YUZZI_FRONTEND_URL}/confirm-subscription?email=${encodeURIComponent(email)}
      `,
    });

    // Add to Mailchimp with pending status
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: 'pending',
    });

    console.log('Subscriber added to Mailchimp:', response);
    return true;
  } catch (error: unknown) {
    console.error('Failed to add subscriber to Mailchimp:', error);

    // Handle specific Mailchimp errors
    if (error && typeof error === 'object' && 'response' in error) {
      const mailchimpError = error as { response?: { body?: { title?: string }; status?: number } };

      if (mailchimpError.response?.body?.title === 'Member Exists') {
        throw new Error('This email address is already subscribed to our newsletter.');
      }

      if (mailchimpError.response?.body?.title === 'Invalid Resource') {
        throw new Error('Invalid email address format.');
      }

      if (mailchimpError.response?.status === 401) {
        throw new Error('Mailchimp API authentication failed. Please contact support.');
      }

      if (mailchimpError.response?.status === 404) {
        throw new Error('Newsletter list not found. Please contact support.');
      }
    }

    // Generic error for other cases
    throw new Error('Failed to add subscriber to newsletter. Please try again later.');
  }
};
