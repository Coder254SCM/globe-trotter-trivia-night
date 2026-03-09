
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const AutoInitializer = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Questions are now generated client-side on-demand when DB is empty.
    // No bulk initialization needed — the clean fetcher handles fallback.
    console.log('✅ AutoInitializer: Questions will be generated on-demand from verified data.');
  }, []);

  return null;
};
