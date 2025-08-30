import Link from 'next/link';

import CreatePostModal from '@/components/post/create-post-modal';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                CollabWrite
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              A knowledge-sharing platform where ideas come to life. Share your thoughts,
              learn from others, and build a collaborative community of learners.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Platform</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/feed"
                  className="hover:text-primary transition-colors"
                >
                  Browse Posts
                </Link>
              </li>
              <li>
                <CreatePostModal>
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    Write a Post
                  </span>
                </CreatePostModal>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className="hover:text-primary transition-colors"
                >
                  Join Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Categories</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Technology
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Lifestyle
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Health
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Food
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>
            &copy; 2025 CollabWrite.
          </p>

          <p>
            Built by
            <a href="https://www.shivamtaneja.com/" className='pl-1 hover:underline' target='_blank'>
              <span className="hover:text-primary transition-colors cursor-pointer">
                Shivam.
              </span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}