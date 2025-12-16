import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Book, Author } from "@/types/schema";
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
import { Label } from "@repo/ui/components/label";
import { z } from "zod";
import { AuthorsCombobox } from "./author-combobox";

type BooksMutateDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Partial<Book>;
    onSubmit: (data: Partial<Book>) => void;
    authors: Author[];
};
export const BookFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    isbn: z.string().optional(),
    authors: z.array(z.object({ _id: z.string(), name: z.string() })).min(1, "Select at least one author"),
});
export type BookForm = z.infer<typeof BookFormSchema>;

export function BooksMutateDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    authors,
}: BooksMutateDialogProps) {
    const form = useForm<BookForm>({
        resolver: zodResolver(BookFormSchema),
        defaultValues: {
            title: initialData?.title ?? "",
            isbn: initialData?.isbn ?? "",
            authors: initialData?.authors ?? [],
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData?._id ? "Edit Book" : "Add Book"}</DialogTitle>
                    <DialogDescription>
                        {initialData?._id
                            ? "Update the book information below."
                            : "Enter the information for the new book."}
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={form.handleSubmit((data) => {
                        onSubmit({
                            ...initialData,
                            title: data.title,
                            isbn: data.isbn,
                            authorIds: data.authors.map((a) => a._id),
                        });
                        onOpenChange(false);
                        form.reset();
                    })}
                    className="space-y-4"
                >
                    <div className="grid gap-3">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...form.register("title")} />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input id="isbn" {...form.register("isbn")} />
                    </div>
                    <div className="grid gap-3">
                        <Controller
                            control={form.control}
                            name="authors"
                            render={({ field }) => (
                                <AuthorsCombobox
                                    authors={authors}
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    label="Authors"
                                    placeholder="Select authors..."
                                />
                            )}
                        />
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
            </DialogContent>
        </Dialog>
    );
}