import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryRequestSchema, type Category, type CategoryRequest } from "@/types";
import { Button } from "@repo/ui/components/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { X } from "lucide-react";
import { LanguageSelect } from "./language-select";
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@repo/ui/components/form";

type CategoriesMutateDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Partial<Category>;
    onSubmit: (data: CategoryRequest) => void;
};

export function CategoriesMutateDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: CategoriesMutateDialogProps) {
    const form = useForm<CategoryRequest>({
        resolver: zodResolver(CategoryRequestSchema),
        defaultValues: {
            slug: initialData?.slug ?? "",
            translations: initialData?.translations?.map(t => ({
                lang: t.lang,
                name: t.name,
                description: t.description ?? ""
            })) ?? [
                { lang: "vn", name: "", description: "" }
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "translations",
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{initialData?.id ? "Edit Category" : "Add Category"}</DialogTitle>
                    <DialogDescription>
                        {initialData?.id
                            ? "Update the category information below."
                            : "Enter the information for the new category."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => {
                            onSubmit({
                                ...data,
                                id: initialData?.id,
                            });
                            onOpenChange(false);
                            form.reset();
                        })}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <div className="grid gap-3">
                                    <FormLabel htmlFor="slug">Slug</FormLabel>
                                    <FormControl>
                                        <Input id="slug" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ lang: "", name: "", description: "" })}
                        >
                            Add translation
                        </Button>

                        <div className="max-h-72 overflow-auto space-y-3">
                            {fields.map((field, idx) => {
                                const selectedLangs = fields.map((f, i) => i !== idx ? f.lang : null).filter(Boolean);

                                return (
                                    <div key={field.id} className="relative border p-4 rounded space-y-2 bg-muted/40">
                                        {/* Nút xoá bản dịch */}
                                        {fields.length > 1 && (
                                            <div className="flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => remove(idx)}
                                                    tabIndex={-1}
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        )}

                                        <FormField
                                            control={form.control}
                                            name={`translations.${idx}.lang`}
                                            render={({ field }) => (
                                                <div className="grid gap-3">
                                                    <FormLabel htmlFor={`translations.${idx}.lang`} className="whitespace-nowrap">Language</FormLabel>
                                                    <FormControl>
                                                        <LanguageSelect
                                                            value={field.value ?? ''}
                                                            onChange={field.onChange}
                                                            id={`translations.${idx}.lang`}
                                                            name={field.name}
                                                            disabledValues={selectedLangs as string[]}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`translations.${idx}.name`}
                                            render={({ field }) => (
                                                <div className="grid gap-3">
                                                    <FormLabel htmlFor={`translations.${idx}.name`}>Name</FormLabel>
                                                    <FormControl>
                                                        <Input id={`translations.${idx}.name`} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`translations.${idx}.description`}
                                            render={({ field }) => (
                                                <div className="grid gap-3">
                                                    <FormLabel htmlFor={`translations.${idx}.description`}>Description</FormLabel>
                                                    <FormControl>
                                                        <Input id={`translations.${idx}.description`} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                {initialData?.id ? "Save changes" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}