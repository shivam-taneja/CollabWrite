import { PostCategory } from "@/types/post"

export const FEED_LIMIT = 10

export const categoryColors: Record<PostCategory, string> = {
  Tech: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Life: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  Health: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}