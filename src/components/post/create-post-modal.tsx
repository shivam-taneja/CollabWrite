"use client";

import { ReactNode, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCreatePost } from "@/hooks/api/post/useCreatePosts";
import { account } from "@/lib/appwrite-client";

import { useAuthActions } from "@/core/auth";
import { createPostSchema, CreatePostSchemaT } from "@/schema/post";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

function CreatePostModal({ children }: { children: ReactNode }) {
  const { logout } = useAuthActions()
  const router = useRouter();
  const {
    mutateAsync,
    isPending
  } = useCreatePost();

  const [open, setOpen] = useState(false);

  const form = useForm<CreatePostSchemaT>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: ""
    },
    mode: 'all'
  });

  async function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      try {
        await account.get();
        setOpen(true);
      } catch {
        logout()

        router.push("/auth/login");
      }
    } else {
      setOpen(false);
    }
  }

  async function onSubmit(values: CreatePostSchemaT) {
    try {
      const response = await mutateAsync({ title: values.title })

      if (response.success && response.data) {
        router.push(`/post/${response.data.$id}/edit`);
      }
    } catch (err) {
      toast.error("Someting went wrong!")
    } finally {
      setOpen(false);
      form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Post</DialogTitle>
          <DialogDescription hidden />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              variant="gradient"
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />

                  <span>Creating post...</span>
                </>
              ) : "Create Post"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePostModal;