'use client';

import React, { useState } from 'react';

import { mockPosts } from '@/utils/constants';

import { PostCategory } from '@/types/post';

import PostCard from '@/components/home/post-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const POST_CATEGORIES: PostCategory[] = ["Tech", "Life", "Food", "Health", "Other"]

const FeedPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const categories = ['All', ...POST_CATEGORIES]

  const filteredPosts = mockPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Knowledge Feed</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover insights, tutorials, and stories from our community of knowledge sharers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex justify-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'gradient' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category as PostCategory | 'All')}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-muted-foreground">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
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
      </div>
    </div>
  )
}

export default FeedPage