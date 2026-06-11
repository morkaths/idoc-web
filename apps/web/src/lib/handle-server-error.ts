import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface HandleServerErrorOptions {
  toastId?: string | number;
  fallback?: string;
  silent?: boolean;
}

/**
 * Extracts a human-readable error message from various error types.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong!'): string {
  if (!error) return fallback;

  if (error instanceof AxiosError) {
    const data = error.response?.data;
    // Handle different API error structures
    return data?.message || data?.title || data?.error || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
}

/**
 * Global server error handler with toast notification support.
 */
export function handleServerError(error: unknown, options: HandleServerErrorOptions = {}) {
  const { toastId, fallback, silent } = options;

  // eslint-disable-next-line no-console
  console.error('Server Error:', error);

  const message = getErrorMessage(error, fallback);

  if (!silent) {
    toast.error(message, {
      id: toastId,
    });
  }

  return message;
}
