import type React from 'react';
import { cn } from '@/lib/utils';
import { GridPattern } from '@repo/ui/components/grid-pattern';
import { type FeatureType, FEATURES } from './data/feature-data';

export default function FeatureSection() {
  return (
    <div className='mx-auto w-full max-w-5xl space-y-8 p-4'>
      <div className='mx-auto max-w-3xl space-y-2 text-center'>
        <div className='flex justify-center'>
          <div className='rounded-lg border px-4 py-1'>Features</div>
        </div>
        <h2 className='px-4 text-center text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl lg:font-extrabold'>
          Empowering Knowledge in the Digital Age.
        </h2>
        <p className='text-muted-foreground mt-4 text-sm text-balance md:text-base'>
          The all-in-one platform to manage, secure, and scale your digital library infrastructure.
        </p>
      </div>

      <div className='overflow-hidden rounded-lg border'>
        <div className='bg-border grid grid-cols-1 gap-px sm:grid-cols-2 md:grid-cols-3'>
          {FEATURES.map((feature) => (
            <FeatureCard feature={feature} key={feature.title} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeatureCard({
  feature,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  feature: FeatureType;
}) {
  return (
    <div className={cn('bg-background relative overflow-hidden p-6', className)} {...props}>
      <div className='pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full mask-[radial-gradient(farthest-side_at_top,white,transparent)]'>
        <GridPattern
          className='stroke-foreground/20 absolute inset-0 size-full'
          height={40}
          width={40}
          x={5}
        />
      </div>
      <feature.icon aria-hidden className='text-foreground/75 size-6' strokeWidth={1} />
      <h3 className='mt-10 text-sm md:text-base'>{feature.title}</h3>
      <p className='text-muted-foreground relative z-20 mt-2 text-xs font-light'>
        {feature.description}
      </p>
    </div>
  );
}
