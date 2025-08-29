'use client'

import React, { useState } from 'react';

import Link from 'next/link';

import { LoginFormData, loginSchema, SignupFormData, signupSchema } from '@/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BookOpen } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(mode === 'login' ? loginSchema : signupSchema),
    defaultValues: {
      ...(mode === 'signup' && { name: '' }),
      email: '',
      password: ''
    },
    mode: 'all'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    setIsLoading(true);
    setError('');

    try {
      throw new Error("lsjfls")
      // if (mode === 'login') {
      //   const { email, password } = data as LoginFormData;
      //   // const result = await authService.login(email, password);
      //   // if (result.success) {
      //   //   router.push('/feed');
      //   // }
      // } else {
      //   const { name, email, password } = data as SignupFormData;
      //   // const result = await authService.signup(name!, email, password);
      //   // if (result.success) {
      //   //   router.push('/feed');
      //   // }
      // }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full px-3 justify-center items-center flex'>
      <div className='w-full max-w-md space-y-6 '>
        <div className="text-center space-y-2 ">
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

            <CardContent>
              {error && (
                <Alert variant="destructive" className='my-2  '>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
                    {mode === 'login'
                      ? (
                        <>
                          {isLoading ? 'Logging in...' : 'Log In'}
                        </>
                      )
                      : <>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                      </>}
                  </Button>
                </form>
              </Form>

              <div className="flex items-center gap-2 my-2">
                <span className="flex-grow border-t"></span>
                <span className="text-sm text-gray-500">OR</span>
                <span className="flex-grow border-t"></span>
              </div>

              <div className='flex gap-2 flex-col'>
                <Button variant={'outline'}>
                  <FcGoogle />
                  <span>
                    {mode === 'login'
                      ? "Log In with Google"
                      : "Sign Up with Google"}
                  </span>
                </Button>

                <Button variant={'outline'}>
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