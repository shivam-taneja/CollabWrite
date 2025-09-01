import React, { useState } from 'react';

import { UserPostsSection } from '@/types/user';

import DeletePostModal from '@/components/post/delete-post-modal';
import PostSettingsModal from '@/components/post/post-settings-modal';
import UpdatePostModal from '@/components/post/update-post-modal';
import PostDetailsCard from '@/components/shared/post-details-card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Lock, MoreVertical, Pencil, Settings, Trash } from 'lucide-react';

const UserPostCard = ({
  postDetails,
  isOwner = false,
}: {
  postDetails: UserPostsSection['posts'][0];
  isOwner?: boolean;
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { $createdAt, $id, category, summary, title, isPrivate } = postDetails;

  const headerExtras = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault()
            setEditOpen(true)
          }}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" /> Update Post
        </DropdownMenuItem>

        {isOwner && (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault()
                setSettingsOpen(true)
              }}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" /> Update Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.preventDefault()
                setDeleteOpen(true)
              }}
              className="cursor-pointer"
            >
              <Trash className="mr-2 h-4 w-4" /> Delete Post
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu >
  );

  const footerExtras = (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="flex items-center gap-1">
        <Lock className="h-3 w-3" />

        {isPrivate ? 'Private' : 'Public'}
      </Badge>
    </div>
  );

  return (
    <>
      <PostDetailsCard
        id={$id}
        title={title}
        summary={summary}
        category={category}
        createdAt={$createdAt}
        href={`/post/${$id}/edit`}
        headerExtras={headerExtras}
        footerExtras={footerExtras}
        isEdit
      />

      <UpdatePostModal isOpen={editOpen} onOpenChange={setEditOpen} post={postDetails} />
      <DeletePostModal isOpen={deleteOpen} onOpenChange={setDeleteOpen} post={postDetails} />
      <PostSettingsModal isOpen={settingsOpen} onOpenChange={setSettingsOpen} post={postDetails} />
    </>
  );
};

export default UserPostCard;