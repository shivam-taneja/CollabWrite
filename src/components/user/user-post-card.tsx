'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { categoryColors } from '@/utils/constants';
import { formatDistanceToNow } from 'date-fns';

import { UserPostsSection } from '@/types/user';

import EditPostTitleModal from '@/components/post/edit-post-title-modal';
import PostSettingsModal from '@/components/post/post-settings-modal';

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
}: {
  postDetails: UserPostsSection['posts'][0]
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { $createdAt, $id, category, summary, title, isPrivate } = postDetails;

  return (
    <Link href={`/post/${$id}`}>
      <Card className="h-full card-hover cursor-pointer bg-gradient-card relative">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={categoryColors[category] || categoryColors.Other}>
                {category}
              </Badge>

              {isPrivate && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <Lock className="h-3 w-3" />
                  Private
                </Badge>
              )}
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
                    onClick={() => setEditOpen(true)}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit Title
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => alert('Delete Post TODO')}
                    className="cursor-pointer"
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setSettingsOpen(true)}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-card-foreground hover:underline">
            {title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {summary}
          </p>
        </CardContent>

        <EditPostTitleModal
          isOpen={editOpen}
          onOpenChange={setEditOpen}
          post={postDetails}
        />

        {/* <PostSettingsModal
          isOpen={settingsOpen}
          onOpenChange={setSettingsOpen}
          post={postDetails}
        /> */}
      </Card>
    </Link>
  );
};

export default UserPostCard;
