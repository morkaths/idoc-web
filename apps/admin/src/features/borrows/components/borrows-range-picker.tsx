'use client';

import { useEffect, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { Button } from '@repo/ui/components/button';
import { Calendar } from '@repo/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';

type BorrowRangePickerProps = {
  borrowedDate: Date;
  dueDate?: Date;
  onChange: (expire: Date | undefined) => void;
};

export function BorrowRangePicker({ borrowedDate, dueDate, onChange }: BorrowRangePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>(
    dueDate ? { from: borrowedDate, to: dueDate } : { from: borrowedDate, to: undefined }
  );

  useEffect(() => {
    if (range?.to) onChange(range.to);
  }, [range?.to, onChange]);

  return (
    <div className='w-full space-y-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id='borrow-range'
            className='w-full justify-between font-normal'
          >
            {borrowedDate && range?.to
              ? `${borrowedDate.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
              : 'Pick expire date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='range'
            selected={range}
            onSelect={(r) => {
              setRange({
                from: borrowedDate,
                to: r?.to || r?.from || undefined,
              });
            }}
            disabled={(date) => date < borrowedDate}
            defaultMonth={borrowedDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
