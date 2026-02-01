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
import { FindParams } from "@/types";
import { useLocale } from '@/hooks/ui/useLocale';

const FilterSchema = z.object({
    search: z.string().optional(),
    categoryIds: z.array(z.string()).optional(),
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
    const { t, keys } = useLocale('books');
    const form = useForm<FilterForm>({
        resolver: zodResolver(FilterSchema),
        defaultValues: {
            search: "",
            categoryIds: [],
            ...filter,
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(async (data) => {
                    const params: FindParams = {
                        query: data.search,
                        categoryIds: data.categoryIds,
                    };
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
                            <FormLabel htmlFor="search">{t(keys.sidebar.filter.search.label)}</FormLabel>
                            <FormControl>
                                <Input id="search" placeholder={t(keys.sidebar.filter.search.placeholder)} {...field} />
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />
                {/* Categories (multi-select) */}
                <FormField
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => (
                        <div className="grid gap-3">
                            <FormLabel htmlFor="categoryIds">{t(keys.sidebar.filter.categories.label)}</FormLabel>
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
                {/* Reset & Submit */}
                <div className="flex gap-2">
                    <Button variant="outline" type="button" className="flex-1" onClick={() => { form.reset(); onReset(); }}>
                        {t(keys.sidebar.actions.reset)}
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={form.formState.isSubmitting}
                    >
                        {t(keys.sidebar.actions.submit)}
                    </Button>
                </div>
            </form>
        </Form>
    );
}