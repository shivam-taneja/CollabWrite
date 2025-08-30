'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthActions, useIsAuthenticated } from '@/core/auth';
import { account } from '@/lib/appwrite-client';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, PenTool } from 'lucide-react';
import { toast } from 'react-toastify';

const Header = () => {
  const isAuthenticated = useIsAuthenticated();
  const pathname = usePathname();
  const router = useRouter()
  const { logout: logoutStore } = useAuthActions();

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
    ).then().catch()

    router.replace('/')
  }

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
              <Link href="/create">
                <Button variant="gradient" size="sm">
                  <PenTool className="h-4 w-4" />
                  Write
                </Button>
              </Link>

              <Button variant="ghost" size="sm" onClick={handleLogOut} className='hidden xs:block p-1'>
                <LogOut className="h-4 w-4" />
              </Button>
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
  )
}

export default Header