import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "@/types/schema";
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
import { z } from "zod";
import { X } from "lucide-react";
import { LanguageSelect } from "./language-select";
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@repo/ui/components/form";

const CategoryFormSchema = z.object({
    slug: z.string().min(1, "Slug is required"),
    translations: z.array(
        z.object({
            lang: z.string().min(1, "Language is required"),
            name: z.string().min(1, "Name is required"),
            description: z.string().optional(),
        })
    ).min(1, "At least one translation is required"),
});
type CategoryForm = z.infer<typeof CategoryFormSchema>;

type CategoriesMutateDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Partial<Category>;
    onSubmit: (data: Partial<Category>) => void;
};

export function CategoriesMutateDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: CategoriesMutateDialogProps) {
    const form = useForm<CategoryForm>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            slug: initialData?.slug ?? "",
            translations: initialData?.translations ?? [
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
            <DialogContent className="sm:max-w-100">
                <DialogHeader>
                    <DialogTitle>{initialData?._id ? "Edit Category" : "Add Category"}</DialogTitle>
                    <DialogDescription>
                        {initialData?._id
                            ? "Update the category information below."
                            : "Enter the information for the new category."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => {
                            onSubmit({
                                ...initialData,
                                ...data,
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
                                        )}

                                        <FormField
                                            control={form.control}
                                            name={`translations.${idx}.lang`}
                                            render={({ field }) => (
                                                <div className="flex items-center gap-3">
                                                    <FormLabel htmlFor={`translations.${idx}.lang`} className="whitespace-nowrap">Language</FormLabel>
                                                    <FormControl>
                                                        <LanguageSelect
                                                            value={field.value}
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
                                {initialData?._id ? "Save changes" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}