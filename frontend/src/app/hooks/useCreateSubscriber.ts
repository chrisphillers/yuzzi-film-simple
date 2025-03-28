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

// Use the proxied endpoint
const GRAPHQL_ENDPOINT = '/api/graphql';

export const useCreateSubscriber = (): UseCreateSubscriberReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createSubscriber = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        query: CREATE_SUBSCRIBER_MUTATION,
        variables: { email },
      };

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
        const errorMessage = result.errors[0]?.message || 'Unknown GraphQL error';

        // Check for unique constraint violation specifically
        if (
          result.errors[0]?.extensions?.code === 'INTERNAL_SERVER_ERROR' &&
          /unique constraint/i.test(result.errors[0].message)
        ) {
          throw new Error('This email address is already subscribed.');
        }

        throw new Error(errorMessage);
      }

      setLoading(false);
      return true;
    } catch (err) {
      console.error('Full error object:', err);
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
