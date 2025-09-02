'use client';

import { UpdatePostSchemaT, updatePostSchema } from "@/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUpdatePost } from "@/hooks/api/post/useUpdatePost";

import pickDirty from "@/lib/pickDirty";

import { UserPostsSection } from "@/types/user";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const UpdatePostModal = ({
  isOpen,
  onOpenChange,
  post,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: UserPostsSection['posts'][0]
}) => {
  const form = useForm<UpdatePostSchemaT>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: post.title,
      summary: post.summary,
      postId: post.$id
    },
    mode: 'all'
  });

  const { formState: { dirtyFields } } = form

  const {
    mutateAsync,
    isPending
  } = useUpdatePost();

  async function onSubmit(values: UpdatePostSchemaT) {
    try {
      const changedValues = pickDirty(values, dirtyFields);

      await mutateAsync({ postId: values.postId, ...changedValues })
      toast.success("Post updated successfully!");
    } catch (err) {
      toast.error("Someting went wrong!")
    } finally {
      onOpenChange(false);
    }
  }

  const changed = dirtyFields.title || dirtyFields.summary;

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
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription hidden />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea disabled={isPending} placeholder="Enter post summary" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="gradient"
                disabled={isPending || !changed}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />

                    <span>Updating Post...</span>
                  </>
                ) : "Update Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePostModal;
