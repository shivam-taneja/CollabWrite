'use client';

import { UpdatePostSchemaT } from '@/schema/post';
import { PostCategory } from '@/types/post';
import { Controller, UseFormReturn } from 'react-hook-form';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Save } from 'lucide-react';

interface Props {
  form: UseFormReturn<UpdatePostSchemaT>;
  category: PostCategory;
  collaborators: string[];
  onSave: (data: UpdatePostSchemaT) => void;
  isSaving: boolean;
  isDirty: boolean
}

const EditPostHeader = ({ form, category, collaborators, onSave, isSaving, isDirty, }: Props) => {
  const { control, handleSubmit } = form;

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="sticky top-0 z-20 bg-card border-b px-6 pb-2 flex justify-between items-center sm:items-start sm:flex-row flex-col gap-2"
    >
      <div className="flex flex-col gap-2">
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

      <div className="flex items-center gap-2 w-full sm:w-auto">
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
      </div>
    </form>
  );
};

export default EditPostHeader;
