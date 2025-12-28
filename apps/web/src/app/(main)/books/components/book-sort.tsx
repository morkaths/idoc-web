"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@repo/ui/components/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/select";

const SORT_FIELDS = [
    { value: "title", label: "Title" },
    { value: "createdAt", label: "Created At" },
    { value: "updatedAt", label: "Updated At" },
    { value: "year", label: "Year" },
    { value: "price", label: "Price" },
    { value: "pages", label: "Pages" },
];

const SortSchema = z.object({
    sortBy: z.string().default("createdAt").optional(),
    sortOrder: z.enum(["desc", "asc"]).default("desc").optional(),
});

type SortForm = z.infer<typeof SortSchema>;

export interface BookSortProps {
    sort?: Partial<SortForm>;
    onSort: (params: SortForm) => void;
    onReset: () => void;
}

export default function BookSort({
    sort,
    onSort,
    onReset,
}: BookSortProps) {
    const form = useForm<SortForm>({
        resolver: zodResolver(SortSchema),
        defaultValues: {
            sortBy: "createdAt",
            sortOrder: "desc",
            ...sort,
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => {
                    onSort(data);
                })}
                className="space-y-4"
            >
                {/* Sort by */}
                <FormField
                    control={form.control}
                    name="sortBy"
                    render={({ field }) => (
                        <div className="grid gap-3">
                            <FormLabel htmlFor="sortBy">Sort by</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SORT_FIELDS.map((col) => (
                                            <SelectItem key={col.value} value={col.value}>
                                                {col.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />
                {/* Sort order */}
                <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                        <div className="grid gap-3">
                            <FormLabel htmlFor="sortOrder">Order</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="desc">Descending</SelectItem>
                                        <SelectItem value="asc">Ascending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />
                {/* Reset & Submit */}
                <div className="flex gap-2">
                    <Button variant="outline" type="button" className="flex-1" onClick={() => { form.reset(); onReset(); }}>
                        Reset
                    </Button>
                    <Button type="submit" className="flex-1">
                        Apply
                    </Button>
                </div>
            </form>
        </Form>
    );
}