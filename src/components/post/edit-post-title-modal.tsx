'use client';

import { useState } from "react";

import { KnowledgePost } from "@/types/post";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";

const EditPostTitleModal = ({
  isOpen,
  onOpenChange,
  post,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: KnowledgePost;
}) => {
  const [title, setTitle] = useState(post.title);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Title</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="pt-4 flex justify-end">
            <Button variant={'gradient'} onClick={() => onOpenChange(false)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostTitleModal