'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import React from 'react';

import { FEED_LIMIT } from '@/utils/constants';

import { useGetUserPosts } from '@/hooks/api/user/useGetUserPosts';

import { userPostsSchema } from '@/schema/user';

import PostCard from '@/components/home/post-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Loader2 } from 'lucide-react';

const MyPostsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const parsedDefaults = userPostsSchema.safeParse({
    page: searchParams.get("page") || undefined,
  });

  const defaults = parsedDefaults.success
    ? parsedDefaults.data
    : { page: 1 };

  const { data: myPosts, isLoading, isFetching } = useGetUserPosts({
    params: defaults,
    queryOptions: {
      enabled: parsedDefaults.success
    }
  });

  const currentPage = Number(defaults.page);
  const total = myPosts?.total ?? 0;
  const totalPages = Math.ceil(total / FEED_LIMIT);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1)
      params.delete("page");
    else
      params.set("page", String(page));

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">My Posts</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage and view all the posts you&apos;ve created
          </p>
        </div>

        {isLoading || isFetching ? (
          <div className='flex justify-center items-center w-full'>
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <>
            {!parsedDefaults.success ? (
              <div className='flex justify-center items-center w-full '>
                <Alert variant="destructive" className='my-2 text-start max-w-md shadow-xl'>
                  <AlertDescription className='space-y-1'>
                    <span className='text-center w-full'>
                      Invalid filters detected.{" "}
                      <span className='font-medium underline cursor-pointer' onClick={() => router.replace('/my-posts')}>
                        reset
                      </span>
                    </span>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <>
                <div className="text-center text-muted-foreground">
                  {total} post{total !== 1 ? 's' : ''} created
                </div>

                {10 > 0 ? ( // TODO: fix
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* {myPosts.documents.map((post, idx) => (
                    <PostCard key={idx} postDetails={post} showActions />
                  ))} */}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => currentPage > 1 && setPage(currentPage - 1)}
                              />
                            </PaginationItem>

                            {Array.from({ length: totalPages }).map((_, i) => (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  isActive={currentPage === i + 1}
                                  onClick={() => setPage(i + 1)}
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext
                                onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-semibold mb-2">You haven&apos;t created any posts yet</h3>
                    <p className="text-muted-foreground">
                      Start sharing your knowledge and experiences with the community
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;
