'use client';

import React from 'react';

import { useGetFeed } from '@/hooks/feed/useGetFeed';

import PostCard from '@/components/post/post-card';
import { Loader2 } from 'lucide-react';

const LimitedPosts = () => {
  const { data, isLoading } = useGetFeed({
    homepage: true
  });

  const posts = data?.rows ?? [];

  if (isLoading) {
    return (
      <div>
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <>
      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, idx) => (
            <PostCard postDetails={p} key={idx} />
          ))}
        </div>
      ) : (
        <h3 className="text-xl font-semibold mb-2">No posts found</h3>
      )}
    </>
  )
}

export default LimitedPosts