'use client';

import React, { Dispatch, SetStateAction } from 'react';

import { useStopPostSharing } from '@/hooks/api/post/useStopPostSharing';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const StopPostSharingAlert = ({
  postId,
  open,
  onOpenChange
}: {
  postId: string,
  open: boolean,
  onOpenChange: Dispatch<SetStateAction<boolean>>,
}) => {
  const {
    mutateAsync: stopSharing,
    isPending: isStoppingSharing
  } = useStopPostSharing()

  const handleStopSharing = async () => {
    try {
      await stopSharing({
        postId,
      })

    } catch (err) {
      toast.error("Failed to stop post sharing");
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Stop sharing this post?</AlertDialogTitle>
          <AlertDialogDescription>
            Turning off sharing will remove all editors from this post. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isStoppingSharing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleStopSharing()
            }}
            disabled={isStoppingSharing}
            className="bg-gradient-primary card-hover"
          >
            {isStoppingSharing ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </>
            ) : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StopPostSharingAlert