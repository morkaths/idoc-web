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
    return data?.message || data?.title || data?.error || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    if (typeof err.message === 'string') return err.message;
    if (typeof err.error === 'string') return err.error;
    if (typeof err.title === 'string') return err.title;
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

