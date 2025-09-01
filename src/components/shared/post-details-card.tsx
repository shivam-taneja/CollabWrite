import Link from 'next/link';

import React from 'react';

import { categoryColors } from '@/utils/constants';
import { formatDistanceToNow } from 'date-fns';

import { PostCategory } from '@/types/post';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowUpRight, Clock } from 'lucide-react';

type PostDetailsCardProps = {
  id: string;
  title: string;
  summary: string;
  category: PostCategory;
  createdAt: string;
  href?: string;
  headerExtras?: React.ReactNode;
  footerExtras?: React.ReactNode;
  isEdit?: boolean
};

const PostDetailsCard = ({
  id,
  title,
  summary,
  category,
  createdAt,
  href = `/post/${id}`,
  headerExtras,
  footerExtras,
  isEdit = false
}: PostDetailsCardProps) => {
  return (
    <Link href={href} className="group block">
      <Card className="h-full card-hover bg-gradient-card border-0 shadow-md hover:shadow-brand transition-all duration-300 group-hover:scale-[1.02] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <Badge className={`${categoryColors[category] || categoryColors.Other} shadow-sm`}>
              {category}
            </Badge>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </div>

              {headerExtras}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xl leading-tight line-clamp-2 text-card-foreground group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>

            <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60 group-hover:opacity-100 group-hover:w-16 transition-all duration-300" />
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
            {summary}
          </p>

          <div className="flex items-center gap-1 text-xs text-primary/70 group-hover:text-primary transition-colors duration-200">
            <span>
              {isEdit ? "Edit post" : "Read full post"}
            </span>
            <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </div>

          {footerExtras && <div className="mt-3">{footerExtras}</div>}
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostDetailsCard;
