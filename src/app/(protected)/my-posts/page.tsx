'use client';

import React from 'react';

import { useGetUserPosts } from '@/hooks/api/user/useGetUserPosts';

import { Card } from '@/components/ui/card';
import UserPostCard from '@/components/user/user-post-card';
import { Loader2 } from 'lucide-react';

const MyPostsPage = () => {
  const { data: myPosts, isLoading, isFetching } = useGetUserPosts({});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">My Posts</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage and view all the posts you&apos;ve created or contributed to
          </p>
        </div>

        {isLoading || isFetching ? (
          <>
            <div className="flex justify-center items-center w-full">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>

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
          </>
        ) : (
          <>
            {myPosts ? (
              <>
                <div className="text-center text-muted-foreground">
                  {myPosts.totalPosts} post{myPosts.totalPosts !== 1 ? 's' : ''}
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Posts you own</h2>

                  {myPosts.owner.total === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      You don’t own any posts yet. Start creating one!
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myPosts.owner.posts.map((post) => (
                        <div key={post.$id} className="relative">
                          <UserPostCard postDetails={post} isOwner />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Posts shared with you</h2>

                  {myPosts.editor.total === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No posts have been shared with you yet.
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myPosts.editor.posts.map((post) => (
                        <div key={post.$id} className="relative">
                          <UserPostCard postDetails={post} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">
                  You haven&apos;t created or edited any posts yet
                </h3>
                <p className="text-muted-foreground">
                  Start sharing your knowledge and collaborating with others
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;
