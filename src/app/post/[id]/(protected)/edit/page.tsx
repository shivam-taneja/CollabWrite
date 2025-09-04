'use client';

import React, { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { subscribeToPostActivity, subscribeToPostCollaborator, subscribeToPostDetails } from '@/core/post-subscriptions';
import { useQueryClient } from '@tanstack/react-query';

import { useGetPostActivity } from '@/hooks/api/post/useGetPostActivity';
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

  const {
    data: postActivity
  } = useGetPostActivity({
    postId
  })

  useEffect(() => {
    if (!post)
      return;

    const unsubscribePost = subscribeToPostDetails(queryClient, post.$id);

    return () => {
      unsubscribePost?.();
    };
  }, [queryClient, post?.$id]);

  useEffect(() => {
    if (!post?.permissions.collaboratorRowId)
      return;

    const unsubscribeCollab = subscribeToPostCollaborator(
      queryClient,
      post.$id,
      post.permissions.collaboratorRowId
    );

    return () => {
      unsubscribeCollab?.();
    };
  }, [queryClient, post?.$id, post?.permissions.collaboratorRowId]);

  useEffect(() => {
    if (!postActivity)
      return;

    const unsubscribeActivity = subscribeToPostActivity(queryClient, postActivity.$id);

    return () => {
      unsubscribeActivity?.();
    };
  }, [queryClient, postActivity?.$id]);

  useEffect(() => {
    if (!post?.$id)
      return;

    queryClient.invalidateQueries({ queryKey: ["post-details", post.$id] });
  }, [queryClient, post?.$id]);


  if (isLoading) {
    return <Loading />;
  }

  if (isError || !post || !postActivity) {
    return <NotFoundPage />;
  }

  if (!post.permissions.canEdit) {
    return <NotFoundPage />
  }

  return (
    <EditPostPage post={post} postActivity={postActivity} />
  );
};

export default PostEditPage;
