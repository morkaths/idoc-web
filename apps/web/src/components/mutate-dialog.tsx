import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { X } from 'lucide-react';

type MutateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function MutateDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: MutateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="relative">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 rounded-full"
              aria-label="Close"
              tabIndex={-1}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="py-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default MutateDialog;