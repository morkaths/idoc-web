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
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import { Permission } from "@/types";

type PermissionsComboboxProps = {
    permissions: Permission[];
    value: string[];
    onChange: (permissions: string[]) => void;
};

export function PermissionsCombobox({
    permissions,
    value,
    onChange,
}: PermissionsComboboxProps) {
    const id = useId();
    const [open, setOpen] = useState(false);

    const toggleSelection = (permission: Permission) => {
        if (value.includes(permission.id)) {
            onChange(value.filter((id) => id !== permission.id));
        } else {
            onChange([...value, permission.id]);
        }
    };

    const removeSelection = (permission: Permission) => {
        onChange(value.filter((id) => id !== permission.id));
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
                                value.map((permissionId) => {
                                    const permission = permissions.find(p => p.id === permissionId);
                                    return permission ? (
                                        <Badge key={permission.id} variant="outline" className="rounded-sm">
                                            {permission.name}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-4"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    removeSelection(permission);
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
                                <span className="text-muted-foreground">Select permissions...</span>
                            )}
                        </div>
                        <ChevronsUpDownIcon className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                    <Command>
                        <CommandInput placeholder="Search permission..." />
                        <CommandList>
                            <CommandEmpty>No permission found.</CommandEmpty>
                            <CommandGroup>
                                {permissions.map((permission) => (
                                    <CommandItem
                                        key={permission.id}
                                        value={permission.id}
                                        onSelect={() => toggleSelection(permission)}
                                    >
                                        <span className="truncate">{permission.name}</span>
                                        {value.includes(permission.id) && (
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