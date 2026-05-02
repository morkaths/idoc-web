'use client';

import { useEffect, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import { Calendar } from '@repo/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';

type BorrowRangePickerProps = {
  borrowTime: Date;
  expireTime?: Date;
  onChange: (expire: Date | undefined) => void;
};

export function BorrowRangePicker({ borrowTime, expireTime, onChange }: BorrowRangePickerProps) {
  const { t, keys } = useLocale('book');
  const [range, setRange] = useState<DateRange | undefined>(
    expireTime ? { from: borrowTime, to: expireTime } : { from: borrowTime, to: undefined }
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
            {borrowTime && range?.to
              ? `${borrowTime.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
              : t(keys.borrow.dueDate.placeholder)}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='range'
            selected={range}
            onSelect={(r) => {
              setRange({
                from: borrowTime,
                to: r?.to || r?.from || undefined,
              });
            }}
            disabled={(date) => date < borrowTime}
            defaultMonth={borrowTime}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
