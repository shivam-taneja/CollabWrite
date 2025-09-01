'use client';

import { useParams } from 'next/navigation';

import React from 'react';

import { useGetPostDetailsById } from '@/hooks/api/post/useGetPostDetailsById';

import { mockPost } from '@/utils/constants';
import { formatDistanceToNow } from 'date-fns';

import NotFoundPage from '@/app/not-found';
import RichTextRenderer from '@/components/post/rich-text-renderer';

import Loading from '@/components/shared/loading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Tag, User, Users } from 'lucide-react';

const PostDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const postId = params.id;

  // const {
  //   data: post,
  //   isLoading,
  //   isFetching,
  //   isError
  // } = useGetPostDetailsById({
  //   postId
  // });

  // Use mock data for demonstration
  const displayPost = mockPost;

  // if (isLoading || isFetching) {
  //   return <Loading />;
  // }

  // if (isError || !post) {
  //   return <NotFoundPage />;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge variant="secondary" className="text-sm font-medium">
              <Tag className="w-3 h-3 mr-1" />
              {displayPost.category}
            </Badge>

            <div className="flex items-center text-muted-foreground text-sm gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDistanceToNow(displayPost.$createdAt)}
              </span>

              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated {formatDistanceToNow(displayPost.$updatedAt)}
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
            {displayPost.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {displayPost.summary}
          </p>

          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-black/20 border shadow-sm">
                    <AvatarFallback className="text-xs font-semibold">
                      {displayPost.postCollaborators.owner.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Created by</span>
                    </div>
                    <p className="font-semibold text-lg">{displayPost.postCollaborators.owner}</p>
                  </div>
                </div>

                {displayPost.postCollaborators.collaborators.length > 0 && (
                  <>
                    <Separator orientation="vertical" className="hidden lg:block h-12" />
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            {displayPost.postCollaborators.collaborators.length} Collaborator{displayPost.postCollaborators.collaborators.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {displayPost.postCollaborators.collaborators.slice(0, 3).map((collaborator, index) => (
                              <Avatar key={index} className="h-8 w-8 border-black/20 border shadow-sm">
                                <AvatarFallback className="text-xs font-semibold">
                                  {collaborator.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>

                          {displayPost.postCollaborators.collaborators.length > 3 && (
                            <span className="text-sm text-muted-foreground ml-2">
                              +{displayPost.postCollaborators.collaborators.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <RichTextRenderer html={displayPost.content} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostDetailsPage;