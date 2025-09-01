'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { categoryColors } from '@/utils/constants';
import { formatDistanceToNow } from 'date-fns';

import { UserPostsSection } from '@/types/user';

import DeletePostModal from '@/components/post/delete-post-modal';
import PostSettingsModal from '@/components/post/post-settings-modal';
import UpdatePostModal from '@/components/post/update-post-modal';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Clock,
  Lock,
  MoreVertical,
  Pencil,
  Settings,
  Trash,
} from 'lucide-react';

const UserPostCard = ({
  postDetails,
  isOwner = false
}: {
  postDetails: UserPostsSection['posts'][0],
  isOwner?: boolean
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { $createdAt, $id, category, summary, title, isPrivate } = postDetails;

  return (
    <Card className="h-full card-hover bg-gradient-card relative">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={categoryColors[category] || categoryColors.Other}>
              {category}
            </Badge>

            <Badge
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Lock className="h-3 w-3" />
              {isPrivate ? "Private" : "Public"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatDistanceToNow(new Date($createdAt), { addSuffix: true })}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem
                  onClick={(e) => setEditOpen(true)}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" /> Update Post
                </DropdownMenuItem>

                {isOwner &&
                  <>
                    <DropdownMenuItem
                      onClick={(e) => setSettingsOpen(true)}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" /> Update Settings
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      variant='destructive'
                      onClick={(e) => setDeleteOpen(true)}
                      className="cursor-pointer"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete Post
                    </DropdownMenuItem>
                  </>
                }
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>


        <Link href={`/post/${$id}`}>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-card-foreground hover:underline">
            {title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {summary}
        </p>
      </CardContent>

      <UpdatePostModal
        isOpen={editOpen}
        onOpenChange={setEditOpen}
        post={postDetails}
      />

      <DeletePostModal
        isOpen={deleteOpen}
        onOpenChange={setDeleteOpen}
        post={postDetails}
      />

      <PostSettingsModal
        isOpen={settingsOpen}
        onOpenChange={setSettingsOpen}
        post={postDetails}
      />
    </Card>
  );
};

export default UserPostCard;
