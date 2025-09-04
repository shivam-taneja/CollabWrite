'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import React from 'react';

import { useGetPostDetails } from '@/hooks/api/post/useGetPostDetails';

import { format, formatDistanceToNow } from 'date-fns';

import NotFoundPage from '@/app/not-found';
import RichTextRenderer from '@/components/post/rich-text-renderer';

import Loading from '@/components/shared/loading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, Tag, } from 'lucide-react';

const PostDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const postId = params.id;

  const {
    data: post,
    isLoading,
    isFetching,
    isError
  } = useGetPostDetails({
    postId
  });

  if (isLoading || isFetching) {
    return <Loading />;
  }

  if (isError || !post) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-white ">
      <div className="border-b border-gray-200 py-4">
        <div className='max-w-6xl mx-auto px-4'>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/feed" className="hover:underline">Feed</Link>

            <span>/</span>

            <span className="truncate opacity-80 max-w-20 md:max-w-52">{post.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
              <Tag className="mr-1 h-3 w-3" />
              {post.category}
            </Badge>

            <span className="items-center gap-1 text-sm text-muted-foreground hidden [@media(min-width:450px)]:flex">
              <Clock className="h-4 w-4" />
              Updated {formatDistanceToNow(new Date(post.$updatedAt), { addSuffix: true })}
            </span>
          </div>

          {post.permissions.canEdit && (
            <Link
              href={`/post/${post.$id}/edit`}
              className="rounded-full px-4 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Edit Post
            </Link>
          )}
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          {post.title}
        </h1>

        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {post.summary}
        </p>

        <div className="my-4 flex gap-2 items-center border-b pb-4 pt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-black/10 shadow-sm">
              <AvatarFallback className="text-xs font-semibold">
                {post.postCollaborators.owner.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <p className="font-semibold capitalize">{post.postCollaborators.owner}</p>
          </div>

          <p className='text-sm text-muted-foreground'>
            •{" "}
            {format(post.$createdAt, 'MMMM do, yyyy')}
          </p>
        </div>

        <div className="text-gray-800 dark:text-gray-200 leading-relaxed mt-8">
          <RichTextRenderer html={post.content} />
        </div>

        {post.postCollaborators.collaborators.length > 0 && (
          <div className="my-4 pt-8 border-t border-gray-200 ">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Collaborators
              </h3>

              <div className="flex items-center gap-3">
                {post.postCollaborators.collaborators.slice(0, 6).map((collaborator, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                        {collaborator.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {collaborator}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailsPage;