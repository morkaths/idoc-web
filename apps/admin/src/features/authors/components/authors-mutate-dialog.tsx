import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Author } from "@/types/schema";
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
import { DatePicker } from '@/components/date-picker';

// Schema for Author form
export const AuthorFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    avatarUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
    birthDate: z.union([z.date(), z.string(), z.number()]).optional(),
    nationality: z.string().optional(),
    bio: z.string().optional(),
});
export type AuthorForm = z.infer<typeof AuthorFormSchema>;

type AuthorsMutateDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Partial<Author>;
    onSubmit: (data: Partial<Author>) => void;
};

export function AuthorsMutateDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
}: AuthorsMutateDialogProps) {
    const form = useForm<AuthorForm>({
        resolver: zodResolver(AuthorFormSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            avatarUrl: initialData?.avatarUrl ?? "",
            birthDate: initialData?.birthDate ? new Date(initialData.birthDate) : undefined,
            nationality: initialData?.nationality ?? "",
            bio: initialData?.bio ?? "",
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{initialData?._id ? "Edit Author" : "Add Author"}</DialogTitle>
                    <DialogDescription>
                        {initialData?._id
                            ? "Update the author information below."
                            : "Enter the information for the new author."}
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={form.handleSubmit((data) => {
                        let birthDate: Date | undefined = undefined;
                        if (data.birthDate instanceof Date) {
                            birthDate = data.birthDate;
                        } else if (typeof data.birthDate === 'string' || typeof data.birthDate === 'number') {
                            const d = new Date(data.birthDate);
                            birthDate = isNaN(d.getTime()) ? undefined : d;
                        }
                        onSubmit({
                            ...initialData,
                            ...data,
                            birthDate,
                        });
                        onOpenChange(false);
                        form.reset();
                    })}
                    className="space-y-4"
                >
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...form.register("name")} />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="avatarUrl">Avatar URL</Label>
                        <Input id="avatarUrl" {...form.register("avatarUrl")} />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="birthDate">Birth Date</Label>
                        <DatePicker
                            selected={form.watch("birthDate") as Date | undefined}
                            onSelect={date => form.setValue("birthDate", date)}
                            placeholder="Pick a date"
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input id="nationality" {...form.register("nationality")} />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" {...form.register("bio")} />
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
