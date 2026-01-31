import { Fragment, useEffect, useId, useMemo, useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
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
import { useBooks } from "@/hooks/data/useBook";
import { useDebounce } from "@/hooks/ui/useDebounce";

type Item = { id: string; title: string; };

type ItemComboboxProps = {
    value: string;
    onChange: (itemId: string) => void;
    error?: string;
    initialItem?: Item;
};

export function ItemCombobox({ value, onChange, error, initialItem }: ItemComboboxProps) {
    const id = useId();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const debouncedQuery = useDebounce(query);
    const params = useMemo(() => ({
        page,
        query: debouncedQuery,
    }), [page, debouncedQuery]);
    const shouldFetch = open || !!value;
    const { data, isLoading } = useBooks(params, { enabled: shouldFetch }); // Ensure enabled logic is added if not present in hook, but assuming consistency. Note: original code didn't have enabled logic in useBooks call which is inefficient, adding it.
    const [items, setItems] = useState<Item[]>([]);

    // Cache all seen items
    const [itemMap, setItemMap] = useState<Map<string, Item>>(() => {
        const map = new Map<string, Item>();
        if (initialItem) map.set(initialItem.id, initialItem);
        return map;
    });

    const pagination = Array.isArray(data?.pagination) ? data.pagination[0] : data?.pagination;
    const total = pagination?.total ?? 0;
    const limited = pagination?.limit ?? 10;
    const hasMore = page * limited < total;

    useEffect(() => {
        if (data?.data) {
            // Update cache map
            setItemMap(prev => {
                const next = new Map(prev);
                data.data.forEach(i => next.set(i.id, i));
                return next;
            });

            if (page === 1) {
                setItems(data.data);
            } else {
                setItems(prev => {
                    const prevIds = new Set(prev.map(a => a.id));
                    const newItems = data.data.filter(a => !prevIds.has(a.id));
                    return [...prev, ...newItems];
                });
            }
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

    const grouped = useMemo(() => {
        const groups: Record<string, Item[]> = {};
        for (const item of items) {
            const firstChar = item.title?.[0]?.toUpperCase();
            const group = firstChar && /[A-Z]/.test(firstChar) ? firstChar : "#";
            if (!groups[group]) groups[group] = [];
            groups[group].push(item);
        }
        // Sort groups by letter
        return Object.fromEntries(
            Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
        );
    }, [items]);

    const selectedItem = itemMap.get(value);

    return (
        <div className="w-full space-y-2 min-w-0">
            <Popover modal={true} open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedItem ? (
                            <div className="flex-1 text-left truncate min-w-0">{selectedItem.title}</div>
                        ) : (
                            <span className="text-muted-foreground">Select item</span>
                        )}
                        <ChevronsUpDownIcon className="ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-(--radix-popper-anchor-width) p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search item..."
                            value={query}
                            onValueChange={handleSearch}
                        />
                        <CommandList onScroll={handleScroll}>
                            <CommandEmpty>No item found.</CommandEmpty>
                            {Object.entries(grouped).map(([group, groupItems]) => (
                                <Fragment key={group}>
                                    <CommandGroup heading={group}>
                                        {groupItems.map(item => (
                                            <CommandItem
                                                key={item.id}
                                                value={item.id}
                                                onSelect={() => {
                                                    onChange(item.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                {item.title}
                                                {value === item.id && <CheckIcon size={16} className="ml-auto" />}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Fragment>
                            ))}
                            {isLoading && (
                                <div className="p-2 text-center text-xs text-muted-foreground">Loading...</div>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && (
                <p className="text-destructive mt-2 text-xs" role="alert" aria-live="polite">
                    {error}
                </p>
            )}
        </div>
    );
}