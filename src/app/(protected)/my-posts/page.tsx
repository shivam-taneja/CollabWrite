'use client';

import React from 'react';

import { mockPosts } from '@/utils/constants';

import PostCard from '@/components/home/post-card';

const MyPostsPage = () => {
  const myPosts = mockPosts;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">My Posts</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage and view all the posts you&apos;ve created
          </p>
        </div>

        <div className="text-center text-muted-foreground">
          {myPosts.length} post{myPosts.length !== 1 ? 's' : ''} created
        </div>

        {myPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPosts.map((post) => (
              <PostCard key={post.id} post={post} showActions />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">You haven&apos;t created any posts yet</h3>
            <p className="text-muted-foreground">
              Start sharing your knowledge and experiences with the community
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;
