import React from 'react';

import { FeedRow } from '@/types/feed';

import PostDetailsCard from '@/components/shared/post-details-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Users } from 'lucide-react';

const FeedPostCard = ({ postDetails }: { postDetails: FeedRow }) => {
  const { $createdAt, $id, category, postCollaborators, summary, title } = postDetails;

  const footerExtras = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 border-black/20 border shadow-sm">
          <AvatarFallback className="text-xs font-semibold">
            {postCollaborators.owner.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="font-medium text-foreground">{postCollaborators.owner}</span>
          </div>

          {postCollaborators.count > 1 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>
                +{postCollaborators.count - 1} collaborator
                {postCollaborators.count - 1 !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {postCollaborators.count > 1 && (
        <Badge variant="secondary" className="text-xs">
          <Users className="w-3 h-3 mr-1" />
          {postCollaborators.count}
        </Badge>
      )}
    </div>
  );

  return (
    <PostDetailsCard
      id={$id}
      title={title}
      summary={summary}
      category={category}
      createdAt={$createdAt}
      footerExtras={footerExtras}
    />
  );
};

export default FeedPostCard;
