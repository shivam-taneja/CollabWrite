'use client';

import React, { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { subscribeToPostDetails } from '@/core/post-subscriptions';
import { useQueryClient } from '@tanstack/react-query';

import { useGetPostDetails } from '@/hooks/api/post/useGetPostDetails';

import NotFoundPage from '@/app/not-found';
import EditPostPage from '@/components/post/edit/edit-post-page';
import Loading from '@/components/shared/loading';

const PostEditPage = () => {
  const params = useParams<{ id: string }>();
  const postId = params.id;

  const queryClient = useQueryClient()
  const {
    data: post,
    isLoading,
    isError,
  } = useGetPostDetails({
    postId,
    requireAuth: true
  });

  useEffect(() => {
    if (!post)
      return

    const unsubscribe = subscribeToPostDetails(queryClient, post.$id);

    queryClient.invalidateQueries({ queryKey: ["post-details", post.$id] });

    return unsubscribe
  }, [post])

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !post) {
    return <NotFoundPage />;
  }

  return (
    <EditPostPage post={post} />
  );
};

export default PostEditPage;
