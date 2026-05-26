import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  description: string;
}

/**
 * Renders a card displaying a metric, stylized like storage cards with a faded background icon.
 *
 * @param {MetricCardProps} props - The props for the MetricCard component.
 * @returns {React.ReactElement} The rendered metric card component.
 */
export function MetricCard({ title, value, icon: Icon, description }: MetricCardProps) {
  return (
    <Card className='border-border/60 group hover:border-primary relative overflow-hidden border shadow-sm transition-colors duration-150'>
      <div className='absolute top-0 right-0 p-3 opacity-10 duration-150'>
        <Icon size={56} className='shrink-0' />
      </div>
      <CardHeader className='pb-2'>
        <CardTitle className='text-muted-foreground text-sm font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <span className='text-2xl font-bold tracking-tight'>{value}</span>
        </div>
        <p className='text-muted-foreground mt-1 text-xs'>{description}</p>
      </CardContent>
    </Card>
  );
}
