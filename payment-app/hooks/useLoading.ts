import { useState } from 'react';

export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const withLoading = async (callback: () => Promise<void>) => {
    try {
      setLoading(true);
      await callback();
    } finally {
      setLoading(false);
    }
  };

  return { loading, withLoading };
};