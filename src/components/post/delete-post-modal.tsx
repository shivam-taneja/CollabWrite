'use client';

import { useDeletePost } from "@/hooks/api/post/useDeletePost";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const DeletePostModal = ({
  isOpen,
  onOpenChange,
  postId,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
}) => {
  const { mutateAsync, isPending } = useDeletePost();

  async function onDelete() {
    try {
      await mutateAsync({ postId });
      toast.success("Post deleted successfully!");
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      onOpenChange(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isPending) {
          onOpenChange(open);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostModal;
