import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@repo/ui/components/select';
import { LANGUAGE_OPTIONS } from '@/types';

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
  const selected = LANGUAGE_OPTIONS.find(opt => opt.value === value);

  return (
    <Select value={value} onValueChange={onChange} name={name}>
      <SelectTrigger id={id} className="w-36">
        {selected ? (
          <span className="flex items-center gap-2">
            <span className={`fi fi-${selected.value}`} />
            {selected.label}
          </span>
        ) : (
          <span className="text-muted-foreground">Select language</span>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {LANGUAGE_OPTIONS.map(opt => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={disabledValues.includes(opt.value)}
            >
              <span className="flex items-center gap-2">
                <span className={`fi fi-${opt.value}`} />
                {opt.label}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}