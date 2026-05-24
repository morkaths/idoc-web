'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { Button } from '@repo/ui/components/button';
import { Calendar } from '@repo/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * A reusable date range picker component that uses a Popover containing a Calendar.
 * Supports selecting a range and clearing the selected range.
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  className,
  disabled = false,
}: DateRangePickerProps) {
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date-range'
            variant='outline'
            className={cn(
              'w-[280px] justify-start text-left font-normal relative pr-8',
              !value && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y')} - {format(value.to, 'LLL dd, y')}
                </>
              ) : (
                format(value.from, 'LLL dd, y')
              )
            ) : (
              <span>{placeholder}</span>
            )}
            {value?.from && (
              <button
                type='button'
                onClick={handleClear}
                className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors'
                title='Clear range'
              >
                <X className='h-3.5 w-3.5' />
              </button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
