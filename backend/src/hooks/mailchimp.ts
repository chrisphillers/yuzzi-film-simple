import mailchimp from '@mailchimp/mailchimp_marketing';
import { Payload } from 'payload';

// Initialize Mailchimp client
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY || '',
  server: process.env.MAILCHIMP_SERVER_PREFIX || '',
});

// Function to add a subscriber to Mailchimp
export const addSubscriberToMailchimp = async (
  email: string,
  payload: Payload
): Promise<boolean> => {
  try {
    const listId = process.env.MAILCHIMP_LIST_ID;
    if (!listId) {
      throw new Error('MAILCHIMP_LIST_ID is not defined');
    }

    // Send confirmation email
    await payload.sendEmail({
      to: email,
      subject: 'Confirm your subscription to Le Yuzzi',
      html: `
        <h1>Welcome to Le Yuzzi!</h1>
        <p>Thank you for subscribing to our newsletter. Please confirm your subscription by clicking the link below:</p>
        <p><a href="${process.env.FRONTEND_URL}/confirm-subscription?email=${encodeURIComponent(email)}">Confirm Subscription</a></p>
      `,
      text: `
        Welcome to Le Yuzzi!
        
        Thank you for subscribing to our newsletter. Please confirm your subscription by clicking the link below:
        
        ${process.env.FRONTEND_URL}/confirm-subscription?email=${encodeURIComponent(email)}
      `,
    });

    // Add to Mailchimp with pending status
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: 'pending',
    });

    console.log('Subscriber added to Mailchimp:', response);
    return true;
  } catch (error) {
    console.error('Failed to add subscriber to Mailchimp:', error);
    return false;
  }
};
