import { NextRequest, NextResponse } from 'next/server';

interface MailchimpResponse {
  success: boolean;
  message: string;
  error?: string;
}

async function subscribeToMailchimp(email: string): Promise<MailchimpResponse> {
  const config = {
    apiKey: process.env.YUZZI_MAILCHIMP_API_KEY || '',
    serverPrefix: process.env.YUZZI_MAILCHIMP_SERVER_PREFIX || '',
    audienceId: process.env.YUZZI_MAILCHIMP_LIST_ID || '',
  };

  console.log('🔍 Server-side Mailchimp config:', {
    apiKey: config.apiKey ? '***' : 'missing',
    serverPrefix: config.serverPrefix,
    audienceId: config.audienceId,
  });

  if (!config.apiKey || !config.serverPrefix || !config.audienceId) {
    return {
      success: false,
      message: 'Mailchimp configuration is missing.',
    };
  }

  try {
    const url = `https://${config.serverPrefix}.api.mailchimp.com/3.0/lists/${config.audienceId}/members`;

    console.log('Making request to:', url);

    const requestBody = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        SOURCE: 'website-newsletter',
      },
    };

    console.log('Request body:', requestBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('Mailchimp response:', {
      status: response.status,
      ok: response.ok,
      data: data,
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Successfully subscribed to newsletter!',
      };
    }

    // Handle specific Mailchimp error cases
    if (response.status === 400) {
      if (data.title === 'Member Exists') {
        return {
          success: false,
          message: 'This email address is already subscribed to our newsletter.',
          error: 'ALREADY_SUBSCRIBED',
        };
      }

      if (data.title === 'Invalid Resource') {
        return {
          success: false,
          message: 'Please enter a valid email address.',
          error: 'INVALID_EMAIL',
        };
      }
    }

    // Handle other errors
    return {
      success: false,
      message: data.detail || 'Failed to subscribe. Please try again later.',
      error: 'API_ERROR',
    };
  } catch (error) {
    console.error('Mailchimp API error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      error: 'NETWORK_ERROR',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const result = await subscribeToMailchimp(email);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
