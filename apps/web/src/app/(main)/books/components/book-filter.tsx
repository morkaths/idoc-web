"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { CategoriesCombobox } from "./categories-combobox";
import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Slider } from "@repo/ui/components/slider";
import { FindParams } from "@/types";

const FilterSchema = z.object({
    search: z.string().optional(),
    categories: z.array(z.string()).optional(),
    priceRange: z.tuple([z.number(), z.number()]).optional(),
});

type FilterForm = z.infer<typeof FilterSchema>;

export interface BookFilterProps {
    filter?: Partial<FindParams>;
    onFilter: (params: FindParams) => void;
    onReset: () => void;
}

export default function BookFilter({
    filter,
    onFilter,
    onReset,
}: BookFilterProps) {
    const form = useForm<FilterForm>({
        resolver: zodResolver(FilterSchema),
        defaultValues: {
            search: "",
            categories: [],
            priceRange: [0, 1000],
            ...filter,
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(async (data) => {
                    const params: FindParams = {
                        query: data.search,
                        filters: [],
                    };
                    if (data.categories && data.categories.length > 0) {
                        params.filters!.push({ categories: data.categories });
                    }
                    if (data.priceRange) {
                        params.filters!.push({ price: { $gte: data.priceRange[0], $lte: data.priceRange[1] } });
                    }
                    onFilter(params);

                })}
                className="space-y-4"
            >
                {/* Search */}
                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <div className="grid gap-3">
                            <FormLabel htmlFor="search">Search</FormLabel>
                            <FormControl>
                                <Input id="search" placeholder="Search books..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />
                {/* Categories (multi-select) */}
                <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                        <div className="grid gap-3">
                            <FormLabel htmlFor="categories">Categories</FormLabel>
                            <FormControl>
                                <CategoriesCombobox
                                    value={field.value || []}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />
                {/* Year range */}
                <FormField
                    control={form.control}
                    name="priceRange"
                    render={({ field }) => (
                        <div className="grid gap-3">
                            <FormLabel htmlFor="priceRange">Price range</FormLabel>
                            <FormControl>
                                <Slider
                                    min={0}
                                    max={9999}
                                    step={1}
                                    value={field.value || [0, 1000]}
                                    onValueChange={field.onChange}
                                    className="mt-2"
                                />
                            </FormControl>
                            <div className="flex justify-between text-xs mt-1">
                                <span>{field.value?.[0] ?? 0} $</span>
                                <span>{field.value?.[1] ?? 1000} $</span>
                            </div>
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