'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

import { useUserDetails } from '@/core/auth';
import { UpdatePostSchemaT } from '@/schema/post';

import { useGetPostActivity } from '@/hooks/api/post/useGetPostActivity';

import { ACTIVE_TTL_MS } from '@/utils/constants';

import { POST_CATEGORIES, PostActivityDB, PostCategory, PostUserActivity } from '@/types/post';

import DeletePostModal from '../delete-post-modal';
import PostSettingsModal from '../post-settings-modal';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MoreVertical, Save, Settings, Tag, Trash } from 'lucide-react';

interface Props {
  form: UseFormReturn<UpdatePostSchemaT>;
  postId: string,
  isPrivate: boolean,
  category: PostCategory,
  onSave: (data: UpdatePostSchemaT) => void;
  isSaving: boolean;
  isDirty: boolean;
  isOwner: boolean;
  postActivity: PostActivityDB
}

const EditPostHeader = ({
  form,
  category,
  isPrivate,
  postId,
  onSave,
  isSaving,
  isDirty,
  isOwner,
  postActivity
}: Props) => {
  const { control, handleSubmit, setValue, watch } = form;

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const user = useUserDetails();
  const { refetch } = useGetPostActivity({ postId, queryOptions: { enabled: false } });

  useEffect(() => {
    const i = setInterval(() => { refetch(); }, 5000);
    return () => clearInterval(i);
  }, [refetch]);

  const activeUsers: PostUserActivity[] = useMemo(() => {
    try {
      const arr: PostUserActivity[] = JSON.parse(postActivity?.presence || '[]');
      const now = Date.now();
      return Array.isArray(arr)
        ? arr
          .filter(u => u.userId !== user?.$id)
          .filter(u => {
            const t = new Date(u.lastActive).getTime();
            return Number.isFinite(t) && (now - t) <= ACTIVE_TTL_MS;
          })
        : [];
    } catch {
      return [];
    }
  }, [postActivity?.presence, user?.$id]);

  const currentCategory = watch('category') as PostCategory | undefined;
  if (!currentCategory && category) {
    setValue('category', category, { shouldDirty: false });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSave)}
        className="z-20 bg-card border-b px-6 pb-2 flex justify-between items-start [@media(min-width:480px)]:items-start [@media(min-width:480px)]:flex-row flex-col gap-2"
      >
        <div className="flex flex-col gap-2 w-full [@media(min-width:480px)]:w-auto">

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              <Tag className="mr-1 h-3 w-3" />

              {currentCategory ?? category}
            </Badge>

            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  disabled={isSaving}
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val as PostCategory);
                  }}
                >
                  <SelectTrigger className="h-8 w-[160px] cursor-pointer">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {POST_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className='cursor-pointer'>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="text-lg font-semibold"
                disabled={isSaving}
              />
            )}
          />

          <Controller
            name="summary"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                className="text-sm"
                rows={2}
                disabled={isSaving}
              />
            )}
          />
        </div>

        <div className="flex items-center gap-2 w-full [@media(min-width:480px)]:w-auto">
          {activeUsers.map((u) => (
            <Tooltip key={u.userId}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>{u.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{u.displayName}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          <Button size="sm" type="submit" disabled={isSaving || !isDirty} variant={'gradient'}>
            <Save className="w-4 h-4 mr-1" />{" "}
            {isDirty ? "Save" : "Nothing to save"}
          </Button>

          {isOwner &&
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem
                  onClick={() => setSettingsOpen(true)}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" /> Update Settings
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                  className="cursor-pointer"
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        </div>
      </form>

      <DeletePostModal isOpen={deleteOpen} onOpenChange={setDeleteOpen} postId={postId} />
      <PostSettingsModal isOpen={settingsOpen} onOpenChange={setSettingsOpen} postId={postId} isPrivate={isPrivate} />
    </>
  );
};

export default EditPostHeader;
