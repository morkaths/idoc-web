'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@repo/ui/components/empty';

export function ForbiddenView() {
  const router = useRouter();
  const { t, keys } = useLocale('error');

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='flex h-screen items-center border-x'>
        <div>
          <div className='bg-border absolute inset-x-0 h-px' />
          <Empty>
            <EmptyHeader>
              <EmptyTitle className='font-mono text-8xl font-black'>403</EmptyTitle>
              <EmptyDescription className='max-w-xs px-4 text-center text-balance sm:max-w-md'>
                {t(keys[403].description)}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className='flex flex-col flex-wrap justify-center gap-2 px-4 sm:flex-row sm:gap-4'>
                <Button variant='outline' onClick={() => router.back()}>
                  <ArrowLeft /> {t(keys.actions.goBack)}
                </Button>
                <Button onClick={() => router.push('/')}>
                  <Home /> {t(keys.actions.backToHome)}
                </Button>
              </div>
            </EmptyContent>
          </Empty>
          <div className='bg-border absolute inset-x-0 h-px' />
        </div>
      </div>
    </div>
  );
}
