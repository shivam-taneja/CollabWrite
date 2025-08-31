import React from 'react';

import Link from 'next/link';

import { categoryColors } from '@/utils/constants';
import { formatDistanceToNow } from 'date-fns';

import { FeedRow } from '@/types/feed';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';

const PostCard = ({ postDetails, }: { postDetails: FeedRow }) => {
  const { $createdAt, $id, category, postCollaborators, summary, title } = postDetails

  return (
    <Link href={`/post/${$id}`}>
      <Card className="h-full card-hover cursor-pointer bg-gradient-card">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={categoryColors[category]}>
              {category}
            </Badge>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow($createdAt, { addSuffix: true })}
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-card-foreground hover:underline">
            {title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className='text-muted-foreground text-sm leading-relaxed line-clamp-3'>
            {summary}
          </p>
        </CardContent>

        <CardFooter className='pt-0'>
          <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
            <User className='h-3 w-3' />
            <span className='capitalize'>{postCollaborators.owner}</span>
            {postCollaborators.count > 1 && (
              <span>• {postCollaborators.count} collaborator(s)</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PostCard