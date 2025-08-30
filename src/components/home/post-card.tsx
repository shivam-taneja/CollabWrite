'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { formatDistanceToNow } from 'date-fns';

import { KnowledgePost } from '@/types/post';

import EditPostTitleModal from '@/components/post/edit-post-title-modal';
import PostSettingsModal from '@/components/post/post-settings-modal';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Clock, MoreVertical, Pencil, Settings, Trash, User } from 'lucide-react';

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Life: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  Health: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const PostCard = ({ post, showActions = false }: { post: KnowledgePost; showActions?: boolean }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Card className="h-full card-hover cursor-pointer bg-gradient-card">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={categoryColors[post.category]}>
            {post.category}
          </Badge>

          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </div>

            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className='bg-white'>
                  <DropdownMenuItem onClick={() => setEditOpen(true)} className='cursor-pointer'>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Title
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => alert("Delete Post TODO")} className='cursor-pointer'>
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setSettingsOpen(true)} className='cursor-pointer'>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <Link href={`/post/${post.id}`}>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-card-foreground hover:underline">
            {post.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent>
        <p className='text-muted-foreground text-sm leading-relaxed line-clamp-3'>
          {post.summary}
        </p>
      </CardContent>

      <CardFooter className='pt-0'>
        <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
          <User className='h-3 w-3' />
          <span>{post.authorName}</span>
          {post.collaborators && post.collaborators.length > 0 && (
            <span>• {post.collaborators.length} collaborator(s)</span>
          )}
        </div>
      </CardFooter>

      <EditPostTitleModal isOpen={editOpen} onOpenChange={setEditOpen} post={post} />
      <PostSettingsModal isOpen={settingsOpen} onOpenChange={setSettingsOpen} post={post} />
    </Card>
  );
};

export default PostCard