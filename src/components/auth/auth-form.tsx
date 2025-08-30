'use client'

import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { LoginFormData, loginSchema, SignupFormData, signupSchema } from '@/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/hooks/api/auth/use-auth';

import { AuthFormProps } from '@/types/auth';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BookOpen, Loader2 } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();
  const {
    isPending: isLoading,
    mutateAsync,
    error
  } = useAuth(mode)

  const form = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(mode === 'login' ? loginSchema : signupSchema),
    defaultValues: {
      ...(mode === 'signup' && { name: '' }),
      email: '',
      password: ''
    },
    mode: 'all'
  });

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    try {
      const result = await mutateAsync(data)
      if (result.success) {
        if (result.data?.requiresVerification) {
          // TODO: add toast later saying need to verify
        } else {
          router.push("/feed");
        }
      }
    } catch (error) {

    } finally {
      form.reset();
    }
  };

  return (
    <div className='w-full px-3 justify-center items-center flex'>
      <div className='w-full max-w-md space-y-6 '>
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
              CollabWrite
            </span>
          </Link>

          <p className="text-muted-foreground">
            {mode === 'login'
              ? "Welcome back to your knowledge community"
              : "Join the knowledge-sharing community"}
          </p>
        </div>

        <Card className='shadow-xl w-full'>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">
              {mode === 'login'
                ? "Log In"
                : "Create Account"}
            </CardTitle>

            <CardDescription>
              {mode === 'login'
                ? "Enter your credentials to access your account"
                : "Get started with your free CollabWrite account"}
            </CardDescription>

            <CardContent className='overflow-hidden'>
              {error && (
                <Alert variant="destructive" className='my-2 text-start'>
                  <AlertDescription className='space-y-1'>
                    <span className='text-center w-full'>Something went wrong!</span>
                    <span className='break-all'>
                      {error.message}
                    </span>
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                  {mode === 'signup' &&
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              type="text"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage className='text-start' />
                        </FormItem>
                      )}
                    />
                  }

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className='text-start' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            type="password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className='text-start' />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}

                    {mode === 'login'
                      ? isLoading ? 'Logging in...' : 'Log In'
                      : isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </Form>

              <div className="flex items-center gap-2 my-2">
                <span className="flex-grow border-t"></span>
                <span className="text-sm text-gray-500">OR</span>
                <span className="flex-grow border-t"></span>
              </div>

              <div className='flex gap-2 flex-col'>
                <Button disabled={isLoading} variant={'outline'}>
                  <FcGoogle />
                  <span>
                    {mode === 'login'
                      ? "Log In with Google"
                      : "Sign Up with Google"}
                  </span>
                </Button>

                <Button disabled={isLoading} variant={'outline'}>
                  <FaGithub />
                  <span>
                    {mode === 'login'
                      ? "Log In with GitHub"
                      : "Sign Up with GitHub"}
                  </span>
                </Button>
              </div>
            </CardContent>
          </CardHeader>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'login'
              ? "Don't have an account?"
              : "Already have an account?"}{' '}
            <Link href={`/auth/${mode === 'login' ? 'signup' : 'login'}`} className="font-medium text-primary hover:underline">
              {mode === 'login'
                ? "Sign Up"
                : "Log In"}
            </Link>
          </p>
        </div>
      </div>
    </div >
  )
}

export default AuthForm