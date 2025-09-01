'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useGetFeed } from '@/hooks/api/feed/useGetFeed';
import useDebounce from '@/hooks/use-debounce';

import { FeedSearchFormT, feedSearchSchema } from '@/schema/feed';

import { POST_CATEGORIES, PostCategory } from '@/types/post';

import { FEED_LIMIT } from '@/utils/constants';

import PostCard from '@/components/post/post-card';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Loader2, Search } from 'lucide-react';

function cleanParams(params: FeedSearchFormT) {
  const newParams: Partial<FeedSearchFormT> = {};
  if (params.search && params.search.trim() !== '') {
    newParams.search = params.search;
  }
  if (params.category && params.category !== 'All') {
    newParams.category = params.category;
  }
  newParams.offset = params.offset;
  return newParams as FeedSearchFormT;
}

const FeedPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parsedDefaults = feedSearchSchema.safeParse({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || "All",
    offset: Number(searchParams.get('offset')),
  });

  const defaults = parsedDefaults.success
    ? parsedDefaults.data
    : { search: '', category: "All" as PostCategory, offset: 0 };

  const form = useForm<FeedSearchFormT>({
    resolver: zodResolver(feedSearchSchema),
    defaultValues: defaults,
  });

  const { watch, register, setValue } = form;
  const { category, offset } = watch();
  const searchValue = watch('search');

  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    setParam('search', debouncedSearch || undefined);
  }, [debouncedSearch]);

  const { data, isLoading, isFetching } = useGetFeed({
    params: cleanParams({
      search: debouncedSearch,
      category,
      offset,
    }),
    queryOptions: {
      enabled: parsedDefaults.success
    }
  });

  const posts = data?.rows ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;

  const setParam = (key: keyof FeedSearchFormT, value?: string | number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (
      value === undefined ||
      value === '' ||
      (key === 'category' && value === 'All')
    ) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    router.push(`?${params.toString()}`);
    setValue(key, value as any);
  };

  return (
    <section className='bg-gray-50'>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Knowledge Feed</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover insights, tutorials, and stories from our community of knowledge sharers
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                {...register('search')}
                onChange={(e) => setValue('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex justify-center">
              <div className="flex flex-wrap gap-2">
                {['All', ...POST_CATEGORIES].map((c) => (
                  <Button
                    key={c}
                    variant={
                      c === 'All'
                        ? (!category || category === 'All' ? 'gradient' : 'outline')
                        : (category === c ? 'gradient' : 'outline')
                    }
                    size="sm"
                    onClick={() => setParam('category', c === 'All' ? undefined : c)}
                    className="rounded-full"
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {isLoading || isFetching ? (
            <>
              <div className='flex justify-center items-center w-full'>
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
              {!parsedDefaults.success ? (
                <div className='flex justify-center items-center w-full '>
                  <Alert variant="destructive" className='my-2 text-start max-w-md shadow-xl'>
                    <AlertDescription className='space-y-1'>
                      <span className='text-center w-full'>Invalid filters detected.</span>
                      <span className='break-all text-center w-full'>
                        Some search options are not valid.{" "}
                        <span className='font-medium underline cursor-pointer' onClick={() => router.replace('/feed')}>
                          reset
                        </span>
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <>
                  <div className="text-center text-muted-foreground">
                    {total} post{total !== 1 ? 's' : ''} found
                  </div>

                  {posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map((p, idx) => (
                        <PostCard postDetails={p} key={idx} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or category filter
                      </p>
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => page > 1 && setParam('offset', (page - 2) * FEED_LIMIT)}
                              className={page === 1 ? "cursor-not-allowed opacity-50" : ""}
                            />
                          </PaginationItem>

                          {Array.from({ length: totalPages }).map((_, i) => {
                            const isActive = page === i + 1;

                            return (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  isActive={isActive}
                                  onClick={() => setParam('offset', i * FEED_LIMIT)}
                                  className={
                                    isActive
                                      ? "bg-gradient-primary text-white hover:text-white"
                                      : "hover:bg-muted "
                                  }
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => page < totalPages && setParam('offset', page * FEED_LIMIT)}
                              className={page === totalPages ? "cursor-not-allowed opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeedPage;
