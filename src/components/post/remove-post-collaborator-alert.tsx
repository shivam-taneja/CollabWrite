'use client';

import React, { Dispatch, SetStateAction } from 'react';

import { useRemovePostCollaborator } from '@/hooks/api/post/useRemovePostCollaborator';

import { PostCollaboratorsEditorDetails } from '@/types/post';

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

const RemovePostCollaboratorAlert = ({
  postId,
  collaboratorToRemove,
  setCollaboratorToRemove
}: {
  postId: string,
  collaboratorToRemove: PostCollaboratorsEditorDetails | null,
  setCollaboratorToRemove: Dispatch<SetStateAction<PostCollaboratorsEditorDetails | null>>,
}) => {
  const {
    mutateAsync: removeCollaborator,
    isPending: isRemovingCollaborator
  } = useRemovePostCollaborator()

  const handleRemoveCollaborator = async (id: string) => {
    try {
      await removeCollaborator({
        postId,
        collaboratorId: id
      })

    } catch (err) {
      toast.error("Failed to remove collaborator");
    } finally {
      setCollaboratorToRemove(null);
    }
  };

  return (
    <AlertDialog
      open={!!collaboratorToRemove}
      onOpenChange={(open) => {
        if (!open) setCollaboratorToRemove(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove collaborator {collaboratorToRemove?.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will remove
            <span className="font-semibold">
              {" "}{collaboratorToRemove?.email}{" "}
            </span>
            from this post. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isRemovingCollaborator}
            onClick={() => setCollaboratorToRemove(null)}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              if (collaboratorToRemove) {
                handleRemoveCollaborator(collaboratorToRemove.$id)
              }
            }}
            className="bg-gradient-primary card-hover"
            disabled={isRemovingCollaborator}
          >
            {isRemovingCollaborator ? (
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

export default RemovePostCollaboratorAlert