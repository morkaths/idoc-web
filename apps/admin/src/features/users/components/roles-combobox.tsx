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
import { Role } from "@/types";

type RolesComboboxProps = {
    roles: Role[];
    value: string[];
    onChange: (roles: string[]) => void;
};

export function RolesCombobox({
    roles,
    value,
    onChange,
}: RolesComboboxProps) {
    const id = useId();
    const [open, setOpen] = useState(false);

    const toggleSelection = (role: Role) => {
        if (value.includes(role.id)) {
            onChange(value.filter((id) => id !== role.id));
        } else {
            onChange([...value, role.id]);
        }
    };

    const removeSelection = (role: Role) => {
        onChange(value.filter((id) => id !== role.id));
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
                                value.map((roleId) => {
                                    const role = roles.find(r => r.id === roleId);
                                    return role ? (
                                        <Badge key={role.id} variant="outline" className="rounded-sm">
                                            {role.name}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-4"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    removeSelection(role);
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
                                <span className="text-muted-foreground">Select roles...</span>
                            )}
                        </div>
                        <ChevronsUpDownIcon className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                    <Command>
                        <CommandInput placeholder="Search role..." />
                        <CommandList>
                            <CommandEmpty>No role found.</CommandEmpty>
                            <CommandGroup>
                                {roles.map((role) => (
                                    <CommandItem
                                        key={role.id}
                                        value={role.id}
                                        onSelect={() => toggleSelection(role)}
                                    >
                                        <span className="truncate">{role.name}</span>
                                        {value.includes(role.id) && (
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