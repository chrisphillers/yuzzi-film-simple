import { useState } from 'react';

interface ApiError {
  message: string;
}

interface UseCreateSubscriberReturn {
  createSubscriber: (email: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  error: ApiError | null;
}

export const useCreateSubscriber = (): UseCreateSubscriberReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createSubscriber = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        return { success: true };
      } else {
        const errorMessage = result.message;
        setError({ message: errorMessage });
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error('Failed to create subscriber:', err);
      let apiError: ApiError;
      let errorMessage: string;

      if (err instanceof Error) {
        apiError = { message: err.message };
        errorMessage = err.message;
      } else {
        apiError = { message: 'An unknown submission error occurred.' };
        errorMessage = 'An unknown submission error occurred.';
      }

      setError(apiError);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return { createSubscriber, loading, error };
};
