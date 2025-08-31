'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useGetFeed } from '@/hooks/feed/use-get-feed';
import useDebounce from '@/hooks/use-debounce';

import { FeedSearchFormT, feedSearchSchema } from '@/schema/feed';

import { PostCategory } from '@/types/post';

import { FEED_LIMIT } from '@/utils/constants';

import { Button } from '@/components/ui/button';
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

export const POST_CATEGORIES: PostCategory[] = [
  'Tech',
  'Life',
  'Food',
  'Health',
  'Other',
];

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

  const parsedDefaults = feedSearchSchema.parse({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    offset: Number(searchParams.get('offset')) || 0,
  });

  const form = useForm<FeedSearchFormT>({
    resolver: zodResolver(feedSearchSchema),
    defaultValues: {
      category: 'All',
      ...parsedDefaults,
    },
  });

  const { watch, register, setValue } = form;
  const { category, offset } = watch();
  const searchValue = watch('search');

  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    setParam('search', debouncedSearch || undefined);
  }, [debouncedSearch]);

  const { data, isLoading } = useGetFeed({
    params: cleanParams({
      search: debouncedSearch,
      category,
      offset,
    }),
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

        {isLoading ? (
          <div className='flex justify-center items-center w-full'>
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <>
            <div className="text-center text-muted-foreground">
              {total} post{total !== 1 ? 's' : ''} found
            </div>

            {posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* TODO: Render post card here */}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filter
                </p>
              </div>
            )}
          </>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      page > 1 && setParam('offset', (page - 2) * FEED_LIMIT)
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setParam('offset', i * FEED_LIMIT)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      page < totalPages && setParam('offset', page * FEED_LIMIT)
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
