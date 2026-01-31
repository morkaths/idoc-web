"use client";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import env from "@/config/env";

export function Devtools() {
  if (env.app.mode !== 'development') return null;
  return (
    <>
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </>
  );
}