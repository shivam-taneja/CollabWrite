'use client';

import React from 'react';

import { useGetFeed } from '@/hooks/api/feed/useGetFeed';

import PostCard from '@/components/post/post-card';
import { Card } from '@/components/ui/card';

const LimitedPosts = () => {
  const { data, isLoading } = useGetFeed({
    homepage: true
  });

  const posts = data?.rows ?? [];

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="h-48 p-4 animate-pulse">
            <div className="flex flex-col space-y-3 h-full">
              <div className="h-24 bg-gray-300 rounded-md" />

              <div className="h-4 bg-gray-300 rounded w-3/4" />

              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </Card>
        ))}
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