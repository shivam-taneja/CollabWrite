import React from 'react'

import Link from 'next/link'

import { formatDistanceToNow } from 'date-fns'

import { KnowledgePost } from '@/types/post'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Clock, User } from 'lucide-react'

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Life: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  Health: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const PostCard = ({ post }: { post: KnowledgePost }) => {
  return (
    <Link href={`/post/${post.id}`}>
      <Card className="h-full card-hover cursor-pointer bg-gradient-card">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={categoryColors[post.category]}>
              {post.category}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </div>
          </div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-card-foreground">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className='text-muted-foreground text-sm leading-relaxed line-clamp-3'>{post.summary}</p>
        </CardContent>

        <CardFooter className='pt-0'>
          <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
            <User className='h-3 w-3' />
            <span>{post.authorName}</span>
            {post.collaborators && post.collaborators.length > 0 && (
              <span>• {post.collaborators.length} collaborator(s)</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default PostCard