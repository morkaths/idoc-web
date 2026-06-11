'use client';

import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@repo/ui/components/empty';

export function MaintenanceView() {
  const { t, keys } = useLocale('error');

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='flex h-screen items-center border-x'>
        <div>
          <div className='bg-border absolute inset-x-0 h-px' />
          <Empty>
            <EmptyHeader>
              <EmptyTitle className='font-mono text-8xl font-black'>503</EmptyTitle>
              <EmptyDescription className='max-w-xs px-4 text-center text-balance sm:max-w-md'>
                {t(keys[503].description)}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className='flex flex-col flex-wrap justify-center gap-2 px-4 sm:flex-row sm:gap-4'>
                <Button variant='outline' onClick={() => window.location.reload()}>
                  {t(keys.actions.learnMore) || 'Reload'}
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
