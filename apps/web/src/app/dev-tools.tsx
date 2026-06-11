'use client';

import env from '@/config/env';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Devtools() {
  if (env.app.mode !== 'development') return null;
  return (
    <>
      <ReactQueryDevtools buttonPosition='bottom-left' />
    </>
  );
}
