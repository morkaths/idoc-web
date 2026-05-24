import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

/**
 * Renders a simple card to display recommendation evaluation metrics.
 */
export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='text-muted-foreground h-4 w-4' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-muted-foreground mt-1 text-xs'>{description}</p>
      </CardContent>
    </Card>
  );
}
