import { useEffect, useId, useMemo, useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import { useAuthors } from "@/hooks/data/useAuthor";
import { useDebounce } from "@/hooks/ui/useDebounce";

type Author = { _id: string; name: string };

type AuthorsComboboxProps = {
    value: string[];
    onChange: (authors: string[]) => void;
};

export function AuthorsCombobox({
    value,
    onChange,
}: AuthorsComboboxProps) {
    const id = useId();
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query);
    const authorParams = useMemo(() => ({
        page,
        query: debouncedQuery,
    }), [page, debouncedQuery]);
    const { data, isLoading } = useAuthors(authorParams);
    const [authors, setAuthors] = useState<Author[]>([]);
    const pagination = Array.isArray(data?.pagination) ? data.pagination[0] : data?.pagination;
    const total = pagination?.total ?? 0;
    const limited = pagination?.limit ?? 10;
    const hasMore = page * limited < total;

    useEffect(() => {
        if (page === 1) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAuthors(data?.data ?? []);
        } else if (data?.data) {
            setAuthors(prev => {
                const prevIds = new Set(prev.map(a => a._id));
                const newAuthors = data.data.filter(a => !prevIds.has(a._id));
                return [...prev, ...newAuthors];
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

    const toggleSelection = (author: Author) => {
        if (value.includes(author._id)) {
            onChange(value.filter((id) => id !== author._id));
        } else {
            onChange([...value, author._id]);
        }
    };

    const removeSelection = (author: Author) => {
        onChange(value.filter((id) => id !== author._id));
    };

    return (
        <div className="w-full space-y-2">
            <Popover modal={true} open={open} onOpenChange={setOpen}>
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
                                value.map((authorId) => {
                                    const author = authors.find((a) => a._id === authorId);
                                    return author ? (
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
                                    ) : null;
                                })
                            ) : (
                                <span className="text-muted-foreground">Select authors...</span>
                            )}
                        </div>
                        <ChevronsUpDownIcon className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search author..."
                            value={query}
                            onValueChange={handleSearch}
                        />
                        <CommandList
                            className="max-h-60 overflow-y-auto"
                            onScroll={handleScroll}
                        >
                            <CommandEmpty>No author found.</CommandEmpty>
                            <CommandGroup>
                                {authors.map((author) => (
                                    <CommandItem
                                        key={author._id}
                                        value={author._id}
                                        onSelect={() => toggleSelection(author)}
                                    >
                                        <span className="truncate">{author.name}</span>
                                        {value.includes(author._id) && (
                                            <CheckIcon size={16} className="ml-auto" />
                                        )}
                                    </CommandItem>
                                ))}
                                {isLoading && page > 1 && <div className="p-2 text-center text-xs">Loading more...</div>}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}