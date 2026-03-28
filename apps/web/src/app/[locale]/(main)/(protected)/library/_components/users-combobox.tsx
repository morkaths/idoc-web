import { Fragment, useEffect, useId, useMemo, useState } from 'react';
import { UserResponse } from '@/types';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useUsers } from '@/hooks/data/useUser';
import { useDebounce } from '@/hooks/ui/useDebounce';
import { Button } from '@repo/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';

type UserComboboxProps = {
  value: string;
  onChange: (userId: string) => void;
  error?: string;
};

export function UserCombobox({ value, onChange, error }: UserComboboxProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const params = useMemo(
    () => ({
      page,
      query: debouncedQuery,
    }),
    [page, debouncedQuery]
  );

  // FETCH DATA
  const shouldFetch = open || !!value;
  const { data, isLoading } = useUsers(params, { enabled: shouldFetch });
  const [users, setUsers] = useState<UserResponse[]>([]);
  const pagination = Array.isArray(data?.pagination) ? data.pagination[0] : data?.pagination;
  const total = pagination?.total ?? 0;
  const limited = pagination?.limit ?? 10;
  const hasMore = page * limited < total;

  useEffect(() => {
    if (page === 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsers(data?.data ?? []);
    } else if (data?.data) {
      setUsers((prev) => {
        const prevIds = new Set(prev.map((a) => a.id));
        const newUsers = data.data.filter((a) => !prevIds.has(a.id));
        return [...prev, ...newUsers];
      });
    }
  }, [data, page]);

  const handleSearch = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore && !isLoading) {
      setPage((p) => p + 1);
    }
  };

  // Group users by first letter of username (A-Z, #)
  const grouped = useMemo(() => {
    const groups: Record<string, UserResponse[]> = {};
    for (const user of users) {
      const firstChar = user.username?.[0]?.toUpperCase();
      const group = firstChar && /[A-Z]/.test(firstChar) ? firstChar : '#';
      if (!groups[group]) groups[group] = [];
      groups[group].push(user);
    }
    // Sort groups by letter
    return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)));
  }, [users]);

  const selectedUser = users.find((u) => String(u.id) === String(value));

  return (
    <div className='w-full space-y-2'>
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {selectedUser ? (
              <span>
                <span className='font-medium'>{selectedUser.username}</span>
                <span className='text-muted-foreground text-xs'> ({selectedUser.email})</span>
              </span>
            ) : (
              <span className='text-muted-foreground'>Select user</span>
            )}
            <ChevronsUpDownIcon className='ml-2' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full min-w-(--radix-popper-anchor-width) p-0' align='start'>
          <Command>
            <CommandInput placeholder='Search user...' value={query} onValueChange={handleSearch} />
            <CommandList onScroll={handleScroll}>
              <CommandEmpty>No user found.</CommandEmpty>
              {Object.entries(grouped).map(([group, groupUsers]) => (
                <Fragment key={group}>
                  <CommandGroup heading={group}>
                    {groupUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={String(user.id)}
                        onSelect={() => {
                          onChange(String(user.id));
                          setOpen(false);
                        }}
                      >
                        <span className='flex flex-col'>
                          <span className='font-medium'>{user.username}</span>
                          <span className='text-muted-foreground text-xs'>{user.email}</span>
                        </span>
                        {value === String(user.id) && <CheckIcon size={16} className='ml-auto' />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Fragment>
              ))}
              {isLoading && (
                <div className='text-muted-foreground p-2 text-center text-xs'>Loading...</div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className='text-destructive mt-2 text-xs' role='alert' aria-live='polite'>
          {error}
        </p>
      )}
    </div>
  );
}
