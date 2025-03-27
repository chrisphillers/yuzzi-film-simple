import { useState } from 'react';

interface ApiError {
  message: string;
}

interface UseCreateSubscriberReturn {
  createSubscriber: (email: string) => Promise<boolean>;
  loading: boolean;
  error: ApiError | null;
}

const CREATE_SUBSCRIBER_MUTATION = `
  mutation CreateSubscriber($email: String!) {
    createSubscriber(data: { email: $email, source: "website-newsletter" }) {
      id # Request id to confirm creation
    }
  }
`;

// Adjust if Payload backend is on a different URL
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || '/api/graphql';

export const useCreateSubscriber = (): UseCreateSubscriberReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createSubscriber = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here if your 'create' access control
          // for the subscribers collection requires it. Currently it's public.
        },
        body: JSON.stringify({
          query: CREATE_SUBSCRIBER_MUTATION,
          variables: { email },
        }),
      });

      const result = await response.json();

      if (!response.ok || result.errors) {
        const errorMessage = result.errors
          ? result.errors[0].message
          : `Failed to submit email. Status: ${response.status}`;
        // Check for unique constraint violation specifically
        if (
          result.errors &&
          result.errors[0]?.extensions?.code === 'INTERNAL_SERVER_ERROR' &&
          /unique constraint/i.test(result.errors[0].message)
        ) {
          throw new Error('This email address is already subscribed.');
        }
        throw new Error(errorMessage);
      }

      console.log('Subscriber creation initiated:', result.data);
      setLoading(false);
      return true;
    } catch (err) {
      let apiError: ApiError;
      if (err instanceof Error) {
        apiError = { message: err.message };
      } else {
        apiError = { message: 'An unknown submission error occurred.' };
      }
      setError(apiError);
      console.error('Failed to create subscriber:', apiError);
      setLoading(false);
      return false;
    }
  };

  return { createSubscriber, loading, error };
};
