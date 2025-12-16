import { useId, useState } from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command";
import { Label } from "@repo/ui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";

type Author = { _id: string; name: string };

type AuthorsComboboxProps = {
  authors: Author[];
  value: Author[];
  onChange: (authors: Author[]) => void;
  label?: string;
  placeholder?: string;
};

export function AuthorsCombobox({
  authors,
  value,
  onChange,
  label = "Authors",
  placeholder = "Select authors...",
}: AuthorsComboboxProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const toggleSelection = (author: Author) => {
    if (value.find((a) => a._id === author._id)) {
      onChange(value.filter((a) => a._id !== author._id));
    } else {
      onChange([...value, author]);
    }
  };

  const removeSelection = (author: Author) => {
    onChange(value.filter((a) => a._id !== author._id));
  };

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-8 w-full justify-between hover:bg-transparent"
          >
            <div className="flex flex-wrap items-center gap-1 pr-2.5">
              {value.length > 0 ? (
                value.map((author) => (
                  <Badge key={author._id} variant="outline" className="rounded-sm">
                    {author.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-4"
                      onClick={e => {
                        e.stopPropagation();
                        removeSelection(author);
                      }}
                      asChild
                    >
                      <span>
                        <XIcon className="size-3" />
                      </span>
                    </Button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDownIcon className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder="Search author..." />
            <CommandList>
              <CommandEmpty>No author found.</CommandEmpty>
              <CommandGroup>
                {authors.map((author) => (
                  <CommandItem
                    key={author._id}
                    value={author._id}
                    onSelect={() => toggleSelection(author)}
                  >
                    <span className="truncate">{author.name}</span>
                    {value.find((a) => a._id === author._id) && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
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