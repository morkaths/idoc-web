import { useId, useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { Languages } from '@/types';
import { useLocale } from '@/hooks/ui/useLocale';
import { Badge } from '@repo/ui/components/badge';
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

type LanguagesComboboxProps = {
  value: string[];
  onChange: (languages: string[]) => void;
};

export function LanguagesCombobox({ value, onChange }: LanguagesComboboxProps) {
  const id = useId();
  const { t, keys } = useLocale('books');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredLanguages = Languages.filter((lang) =>
    lang.label.toLowerCase().includes(query.toLowerCase()) ||
    lang.value.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 50);

  const toggleSelection = (languageValue: string) => {
    if (value.includes(languageValue)) {
      onChange(value.filter((val) => val !== languageValue));
    } else {
      onChange([...value, languageValue]);
    }
  };

  const removeSelection = (languageValue: string) => {
    onChange(value.filter((val) => val !== languageValue));
  };

  return (
    <div className='w-full space-y-2'>
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='h-auto min-h-8 w-full justify-between hover:bg-transparent'
          >
            <div className='flex flex-wrap items-center gap-1 pr-2.5'>
              {value.length > 0 ? (
                value.map((langValue) => {
                  const language = Languages.find((l) => l.value === langValue);
                  return language ? (
                    <Badge key={language.value} variant='outline' className='rounded-sm'>
                      {language.label}
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-4'
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelection(langValue);
                        }}
                        asChild
                      >
                        <span>
                          <XIcon className='size-3' />
                        </span>
                      </Button>
                    </Badge>
                  ) : null;
                })
              ) : (
                <span className='text-muted-foreground'>
                  {t(keys.sidebar.filter.languages.placeholder)}
                </span>
              )}
            </div>
            <ChevronsUpDownIcon className='text-muted-foreground/80 shrink-0' aria-hidden='true' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-(--radix-popper-anchor-width) p-0'>
          <Command>
            <CommandInput
              placeholder={t(keys.sidebar.filter.languages.searchPlaceholder)}
              value={query}
              onValueChange={setQuery}
            />
            <CommandList className='max-h-60 overflow-y-auto'>
              <CommandEmpty>{t(keys.sidebar.filter.languages.empty)}</CommandEmpty>
              <CommandGroup>
                {filteredLanguages.map((language) => (
                  <CommandItem
                    key={language.value}
                    value={language.value}
                    onSelect={() => toggleSelection(language.value)}
                  >
                    <span className='truncate'>{language.label}</span>
                    {value.includes(language.value) && <CheckIcon size={16} className='ml-auto' />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
