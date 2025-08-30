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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PostSettingsModal = ({
  isOpen,
  onOpenChange,
  post,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: any; // TODO: update
}) => {
  const [isPrivate, setIsPrivate] = useState(post.isPrivate ?? false);
  const [isShared, setIsShared] = useState(post.isShared ?? false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="private">Private</Label>
            <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="shared">Shared</Label>
            <Switch id="shared" checked={isShared} onCheckedChange={setIsShared} />
          </div>

          {isShared && (
            <div className="space-y-2">
              <Label>Collaborators</Label>
              {post.collaborators && post.collaborators.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {post.collaborators.map((c: any) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No collaborators</p>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button onClick={() => onOpenChange(false)} variant={'gradient'}>Update</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostSettingsModal