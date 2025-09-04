'use client';

import { useState } from 'react';

import { Controller, UseFormReturn } from 'react-hook-form';

import { UpdatePostSchemaT } from '@/schema/post';

import { PostCategory, PostDetails } from '@/types/post';

import DeletePostModal from '../delete-post-modal';
import PostSettingsModal from '../post-settings-modal';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MoreVertical, Save, Settings, Trash } from 'lucide-react';

interface Props {
  form: UseFormReturn<UpdatePostSchemaT>;
  postId: string,
  isPrivate: boolean,
  category: PostCategory,
  collaborators: PostDetails['postCollaborators']['collaborators']
  onSave: (data: UpdatePostSchemaT) => void;
  isSaving: boolean;
  isDirty: boolean;
  isOwner: boolean;
}

const EditPostHeader = ({ form, category, collaborators, isPrivate, postId, onSave, isSaving, isDirty, isOwner, }: Props) => {
  const { control, handleSubmit } = form;

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // TODO: add option to update category
  return (
    <>
      <form
        onSubmit={handleSubmit(onSave)}
        className="z-20 bg-card border-b px-6 pb-2 flex justify-between items-start [@media(min-width:480px)]:items-start [@media(min-width:480px)]:flex-row flex-col gap-2"
      >
        <div className="flex flex-col gap-2 w-full [@media(min-width:480px)]:w-auto">
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
          {collaborators.map((c) => (
            <Tooltip key={c}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>{c[0]}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{c}</p>
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
                  onClick={(e) => setSettingsOpen(true)}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" /> Update Settings
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => setDeleteOpen(true)}
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
