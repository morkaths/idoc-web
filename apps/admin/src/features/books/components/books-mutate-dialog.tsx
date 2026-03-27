'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookRequestSchema, type Book, type BookRequest } from "@/types";
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
import { AuthorsCombobox } from "./authors-combobox";
import { Textarea } from "@repo/ui/components/textarea";
import { CategoriesCombobox } from "./categories-combobox";
import { LanguageSelect } from "./language-select";
import { ImageUpload } from '@/components/form/image-upload';
import { FileUpload } from '@/components/form/file-upload';
import { useUploadPresignedFile, useCompletePresignUploadFile, useFile, useDeleteFile } from "@/hooks/data/useFile";
import { toast } from 'sonner';
import { DatePicker } from '@/components/form/date-picker';
import { useUploadImage } from '@/hooks/data/useImage';
import { FileItem } from '@/components/form/file-item';
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@repo/ui/components/form';

type BooksMutateDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Partial<Book>;
    onSubmit: (data: BookRequest) => void;
};

export function BooksMutateDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: BooksMutateDialogProps) {
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const uploadImage = useUploadImage();
    const uploadFile = useUploadPresignedFile();
    const confirmUpload = useCompletePresignUploadFile();
    const deleteFile = useDeleteFile();
    const { data: file } = useFile(initialData?.file || "");

    const form = useForm<BookRequest>({
        resolver: zodResolver(BookRequestSchema),
        defaultValues: {
            title: initialData?.title ?? "",
            description: initialData?.description ?? "",
            slug: initialData?.slug ?? "",
            publisher: initialData?.publisher ?? "",
            publishedDate: initialData?.publishedDate ? new Date(initialData.publishedDate) : undefined,
            edition: initialData?.edition ?? "",
            isbn: initialData?.isbn ?? "",
            language: initialData?.language ?? "",
            pages: initialData?.pages ?? 0,
            price: initialData?.price ?? 0,
            stock: initialData?.stock ?? 0,
            coverUrl: initialData?.coverUrl ?? "",
            file: initialData?.file ?? "",
            tags: initialData?.tags ?? [],
            authors: initialData?.authors?.map((a) => a.id) ?? [],
            categories: initialData?.categories?.map((c) => c.id) ?? [],
        },
    });

    function handleFileUpload(files: File[]): void {
        setFiles(files);
        if (!files.length) {
            form.setValue("file", "");
            setFiles([]);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData?.id ? "Edit Book" : "Add Book"}</DialogTitle>
                    <DialogDescription>
                        {initialData?.id
                            ? "Update the book information below."
                            : "Enter the information for the new book."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(async (data) => {
                            let coverUrl = data.coverUrl;
                            let fileValue = data.file;

                            try {
                                if (coverFile) {
                                    toast.loading("Uploading cover image...", { id: "upload-cover" });
                                    coverUrl = await uploadImage.mutateAsync({ file: coverFile, folder: "books" });
                                    toast.success("Cover image uploaded!", { id: "upload-cover" });
                                }
                            } catch {
                                toast.error("Upload cover image failed!", { id: "upload-cover" });
                                return;
                            }

                            try {
                                if (files.length > 0) {
                                    toast.loading("Uploading book file...", { id: "upload-file" });
                                    const key = await uploadFile.mutateAsync({ file: files[0], folder: "books" });
                                    const fileResult = await confirmUpload.mutateAsync(key);
                                    fileValue = fileResult.id;
                                    toast.success("Book file uploaded!", { id: "upload-file" });
                                }
                            } catch {
                                toast.error("Upload book file failed!", { id: "upload-file" });
                                return;
                            }

                            onSubmit({
                                ...data,
                                id: initialData?.id,
                                coverUrl,
                                file: fileValue,
                            });
                            onOpenChange(false);
                            form.reset();
                        })}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            {/* Cột trái: Upload ảnh, chiếm 1 cột và 3 hàng */}
                            <div className="md:row-span-3 flex flex-col items-center justify-start">
                                <Label className="mb-3">Cover Image</Label>
                                <ImageUpload
                                    value={form.getValues("coverUrl")}
                                    onChange={(file, previewUrl) => {
                                        setCoverFile(file);
                                        form.setValue("coverUrl", previewUrl || "");
                                    }}
                                />
                            </div>
                            {/* Cột phải: Các trường nhập liệu chính */}
                            <div className="md:col-span-3 grid grid-cols-1 gap-3">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <div className="grid gap-3">
                                            <FormLabel htmlFor="title">Title</FormLabel>
                                            <FormControl>
                                                <Input id="title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                    <FormField
                                        control={form.control}
                                        name="isbn"
                                        render={({ field }) => (
                                            <div className="grid gap-3">
                                                <FormLabel htmlFor="isbn">ISBN</FormLabel>
                                                <FormControl>
                                                    <Input id="isbn" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                        <div className="grid gap-3">
                                            <FormLabel htmlFor="language">Language</FormLabel>
                                            <FormControl>
                                                <LanguageSelect
                                                    id="language"
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        {/* Các trường dài để bên dưới full width */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <FormField
                                control={form.control}
                                name="publisher"
                                render={({ field }) => (
                                    <div className="grid gap-3">
                                        <FormLabel htmlFor="publisher">Publisher</FormLabel>
                                        <FormControl>
                                            <Input id="publisher" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="publishedDate"
                                render={({ field }) => (
                                    <div className="grid gap-3">
                                        <FormLabel htmlFor="publishedDate">Published Date</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={field.onChange}
                                                placeholder="Pick a date"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="edition"
                            render={({ field }) => (
                                <div className="grid gap-3 mb-3">
                                    <FormLabel htmlFor="edition">Edition</FormLabel>
                                    <FormControl>
                                        <Input id="edition" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <FormField
                                control={form.control}
                                name="pages"
                                render={({ field }) => (
                                    <div className="grid gap-3">
                                        <FormLabel htmlFor="pages">Pages</FormLabel>
                                        <FormControl>
                                            <Input id="pages" type="number" min={0} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <div className="grid gap-3">
                                        <FormLabel htmlFor="price">Price</FormLabel>
                                        <FormControl>
                                            <Input id="price" type="number" min={0} step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <div className="grid gap-3">
                                        <FormLabel htmlFor="stock">Stock</FormLabel>
                                        <FormControl>
                                            <Input id="stock" type="number" min={0} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <div className="grid gap-3 mb-3">
                                    <FormLabel htmlFor="description">Description</FormLabel>
                                    <FormControl>
                                        <Textarea id="description" {...field} rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <div className="grid gap-3 mb-3">
                                    <FormLabel htmlFor="tags">Tags (comma separated)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id="tags"
                                            {...field}
                                            value={Array.isArray(field.value) ? field.value.join(', ') : (field.value || '')}
                                            onChange={e => field.onChange(
                                                e.target.value
                                                    .split(",")
                                                    .map((s) => s.trim())
                                                    .filter(Boolean)
                                            )}
                                            rows={2}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="authors"
                            render={({ field }) => (
                                <div className="grid gap-3 mb-3">
                                    <FormLabel>Authors</FormLabel>
                                    <FormControl>
                                        <AuthorsCombobox
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            initialAuthors={initialData?.authors}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                                <div className="grid gap-3 mb-3">
                                    <FormLabel>Categories</FormLabel>
                                    <FormControl>
                                        <CategoriesCombobox
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            initialCategories={initialData?.categories}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />
                        <div className="grid mb-3">
                            <FileUpload
                                value={files}
                                onChange={handleFileUpload}
                                label="Upload documents"
                                accept=".pdf,.doc,.docx,.zip"
                                maxSizeMB={100}
                            />
                            {file && (
                                <div className="space-y-3 mt-4 px-4">
                                    <FileItem
                                        key={file.originalname}
                                        file={file}
                                        progress={100}
                                        onDelete={async () => {
                                            if (file) await deleteFile.mutateAsync(file.id);
                                            form.setValue("file", "");
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={uploadImage.isPending || uploadFile.isPending || confirmUpload.isPending}>
                                {initialData?.id ? "Save changes" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}