'use client';

import { useEffect, useState } from 'react';

import { PostCategory, UpdatePostDetails } from '@/types/post';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Save } from 'lucide-react';

interface Props {
  title: string
  summary: string
  category: PostCategory
  collaborators: string[]
  onSave: (data: { updatedDetails: Partial<UpdatePostDetails> }) => void
  isSaving: boolean
}

const EditPostHeader = ({ title, summary, category, isSaving, collaborators, onSave }: Props) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localSummary, setLocalSummary] = useState(summary);

  const handleSave = () => {
    const updatedDetails: Partial<UpdatePostDetails> = {};

    if (localTitle !== title) {
      updatedDetails.title = localTitle;
    }

    if (localSummary !== summary) {
      updatedDetails.summary = localSummary;
    }

    if (Object.keys(updatedDetails).length > 0) {
      onSave({ updatedDetails });
    }
  };

  useEffect(() => {
    setLocalTitle(title)
    setLocalSummary(summary)
  }, [title, summary])

  return (
    <div className="sticky top-0 z-20 bg-card border-b px-6 pb-2 flex justify-between items-center sm:items-start sm:flex-row flex-col gap-2">
      <div className='flex flex-col gap-2'>
        <Input
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          className="text-lg font-semibold"
          disabled={isSaving}
        />
        <Textarea
          value={localSummary}
          onChange={(e) => setLocalSummary(e.target.value)}
          className="text-sm"
          rows={2}
          disabled={isSaving}
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

        <Button size="sm" onClick={handleSave} disabled={isSaving} variant={'gradient'}>
          <Save className="w-4 h-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  )
}

export default EditPostHeader