"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useAddCollaborator } from "@/hooks/api/post/useAddCollaborator";
import { useGetCollaborators } from "@/hooks/api/post/useGetCollaborators";
import { useUpdatePostPrivacy } from "@/hooks/api/post/useUpdatePostPrivacy";

import { addPostCollaboratorSchema, AddPostCollaboratorSchemaT } from "@/schema/post";

import { PostCollaboratorsEditorDetails } from "@/types/post";

import RemovePostCollaboratorAlert from "./remove-post-collaborator-alert";
import StopPostSharingAlert from "./stop-post-sharing-alert";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const PostSettingsModal = ({
  isOpen,
  onOpenChange,
  postId,
  isPrivate
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  isPrivate: boolean
}) => {
  const [isShared, setIsShared] = useState(false);
  const [stopPostSharingConfirmOpen, setStopPostSharingConfirmOpen] = useState(false);
  const [collaboratorToRemove, setCollaboratorToRemove] = useState<PostCollaboratorsEditorDetails | null>(null);

  const { data: collaborators, isLoading, isFetching } = useGetCollaborators({
    postId,
    queryOptions: { enabled: isOpen },
  });
  const {
    mutateAsync: addCollaborator,
    isPending: isAddingCollaborator
  } = useAddCollaborator();
  const {
    mutateAsync: updatePostPrivacy,
    isPending: isUpdatingPostPrivacy
  } = useUpdatePostPrivacy()

  const form = useForm<AddPostCollaboratorSchemaT>({
    resolver: zodResolver(addPostCollaboratorSchema),
    defaultValues: { email: "", postId: postId },
    mode: 'all'
  });

  const handleAddCollaborator = async (values: AddPostCollaboratorSchemaT) => {
    try {
      await addCollaborator(values)

      toast.info("If this collaborator exists, the collaborator will be added.");
    } catch (err) {
      toast.error("Failed to add collaborator");
    } finally {
      form.reset()
    }
  };

  const handlePrivateToggle = async (checked: boolean) => {
    try {
      await updatePostPrivacy({
        postId: postId,
        privacySetting: checked
      })
    } catch (err) {
      toast.error("Failed to update privacy");
    } finally {
      onOpenChange(false)
    }
  }

  const handleSharedToggle = (checked: boolean) => {
    if (!checked && collaborators && collaborators.length > 0) {
      setStopPostSharingConfirmOpen(true);
      return;
    }

    setIsShared(true)
  };

  useEffect(() => {
    if (!isLoading || !isFetching) {
      setIsShared((collaborators?.length ?? 0) > 0);
    }
  }, [isLoading, collaborators, isFetching]);

  const waitForActionsToComplete = isAddingCollaborator || isUpdatingPostPrivacy

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!waitForActionsToComplete) {
            onOpenChange(open);
          }
        }}
      >
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Post settings
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Manage privacy, sharing, and collaborators for this post.
            </p>
          </DialogHeader>

          {isLoading || isFetching ? (
            <div className="flex gap-2 items-center py-6 justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <span>Loading...</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="space-y-3 pb-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="private">Private</Label>
                  <Switch
                    id="private"
                    checked={isPrivate}
                    onCheckedChange={handlePrivateToggle}
                    className="cursor-pointer"
                    disabled={waitForActionsToComplete}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="shared">Shared</Label>
                  <Switch
                    id="shared"
                    checked={isShared}
                    onCheckedChange={handleSharedToggle}
                    className="cursor-pointer"
                    disabled={waitForActionsToComplete}
                  />
                </div>
              </div>

              {isShared && (
                <div className="space-y-4 border-t">
                  <div className="pt-2">
                    <Label className="text-sm font-medium">Collaborators</Label>
                    <div className="mt-3 space-y-2">
                      {collaborators?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No collaborators yet
                        </p>
                      ) : (
                        <>
                          {collaborators?.map((c) => (
                            <div
                              key={c.$id}
                              className="flex items-center justify-between rounded-xl border p-3 hover:bg-muted/40 transition"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {c.displayName[0]}
                                  </AvatarFallback>
                                </Avatar>

                                <div>
                                  <p className="text-sm font-medium">{c.displayName}</p>
                                  <p className="text-xs text-muted-foreground">{c.email}</p>
                                  <p className="text-xs font-semibold text-purple-500 capitalize">{c.role}</p>
                                </div>
                              </div>

                              {c.role === 'editor' &&
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setCollaboratorToRemove(c)}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  disabled={waitForActionsToComplete}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              }
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleAddCollaborator)}
                      className="flex gap-2"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Enter collaborator email"
                                {...field}
                                className="rounded-xl"
                                disabled={waitForActionsToComplete}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        variant="gradient"
                        className="rounded-xl"
                        disabled={waitForActionsToComplete}
                      >
                        {isAddingCollaborator ? (
                          <>
                            <Loader2 className="w-8 h-8 animate-spin text-white" />
                          </>
                        ) : "Add"}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}

              <div className="flex justify-start pt-4">
                <Button
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl"
                  variant={'gradient'}
                  disabled={waitForActionsToComplete}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RemovePostCollaboratorAlert
        collaboratorToRemove={collaboratorToRemove}
        postId={postId}
        setCollaboratorToRemove={setCollaboratorToRemove}
      />

      <StopPostSharingAlert
        open={stopPostSharingConfirmOpen}
        onOpenChange={setStopPostSharingConfirmOpen}
        postId={postId}
      />
    </>
  );
};

export default PostSettingsModal;