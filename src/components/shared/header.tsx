'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthActions, useIsAuthenticated, useUserDetails } from '@/core/auth';
import { account } from '@/lib/appwrite-client';
import { cn } from '@/lib/utils';

import CreatePostModal from '@/components/post/create-post-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, LogOut, PenTool } from 'lucide-react';
import { toast } from 'react-toastify';

const Header = () => {
  const isAuthenticated = useIsAuthenticated();
  const pathname = usePathname();
  const router = useRouter();
  const { logout: logoutStore } = useAuthActions();
  const user = useUserDetails();

  const isActive = (path: string) => pathname.includes(path);

  const handleLogOut = async () => {
    await toast.promise(async () => {
      await account.deleteSession('current');
      logoutStore();
    },
      {
        pending: 'Logging out...',
        success: 'Logout Successful',
        error: 'Logout Failed!'
      }
    ).then().catch();

    router.replace('/');
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <Link href={'/'} className='flex items-center space-x-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary'>
            <BookOpen className="h-4 w-4 text-white" />
          </div>

          <span className='font-bold text-xl bg-gradient-primary bg-clip-text text-transparent'>
            CollabWrite
          </span>
        </Link>

        <nav className='hidden md:flex items-center space-x-6'>
          <Link
            href={'/feed'}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isActive("/feed") ? 'text-primary' : "text-muted-foreground"
            )}
          >
            Browse Posts
          </Link>
        </nav>

        <div>
          {isAuthenticated ? (
            <div className='space-x-2 flex items-center'>
              <CreatePostModal>
                <Button variant="gradient" size="sm" className='xs:flex hidden'>
                  <PenTool className="h-4 w-4" />
                  Write
                </Button>
              </CreatePostModal>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback>
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className='space-y-2 bg-white'>
                  <DropdownMenuItem asChild>
                    <CreatePostModal>
                      <Button variant="gradient" size="sm" className='w-full flex xs:hidden'>
                        <PenTool className="h-4 w-4" />
                        Write
                      </Button>
                    </CreatePostModal>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/my-posts" className='cursor-pointer'>My Posts</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleLogOut} className='cursor-pointer'>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className='space-x-2 flex items-center'>
              <Link href="/auth/login" className='hidden xs:block'>
                <Button variant="ghost" size="sm" className='p-1'>Log In</Button>
              </Link>
              <Link href="/auth/signup" >
                <Button variant="gradient" size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
