import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@repo/ui/components/select';
import { LANGUAGE } from '@/types';

export function LanguageSelect({
  value,
  onChange,
  id,
  name,
  disabledValues = [],
}: {
  value: string;
  onChange: (val: string) => void;
  id?: string;
  name?: string;
  disabledValues?: string[];
}) {
  const selected = LANGUAGE.find(opt => opt.value === value);

  return (
    <Select value={value} onValueChange={onChange} name={name}>
      <SelectTrigger id={id} className="w-full">
        {selected ? (
          <span className="flex items-center gap-2 min-w-0 flex-1 text-left">
            <span className={`fi fi-${selected.value} shrink-0`} />
            <span className="truncate">{selected.label}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">Select language</span>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {LANGUAGE.map(opt => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={disabledValues.includes(opt.value)}
            >
              <span className="flex items-center gap-2 min-w-0 flex-1 text-left">
                <span className={`fi fi-${opt.value} shrink-0`} />
                <span className="truncate">{opt.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}