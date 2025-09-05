import Link from "next/link";

import DemoVideo from "@/components/home/demo-video";
import LimitedPosts from "@/components/home/limited-posts";
import CreatePostModal from "@/components/post/create-post-modal";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Edit3, Eye, Globe, MessageCircle, Share2, Sparkles, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative py-20 px-4 sm:py-32 hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 animate-gradient-x" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2  bg-white backdrop-blur-sm border border-primary rounded-full text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  Open Knowledge for Everyone
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl leading-tight">
                  Where Knowledge{' '}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                    Comes Alive
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  The open platform where ideas flourish through collaboration. Create rich content,
                  work together in real-time, and share knowledge that transforms communities.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                  <Link href="/feed">
                    <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                      Dive Into Knowledge
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <CreatePostModal>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto backdrop-blur-sm border-white/30">
                      <Edit3 className="h-4 w-4" />
                      Start Creating
                    </Button>
                  </CreatePostModal>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Open to Everyone
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Real-time Collaboration
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    No Login Required to Read
                  </div>
                </div>
              </div>

              <DemoVideo />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">
              Built for the Future of{' '}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Collaborative Learning
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Experience the power of Wikipedia's openness combined with Notion's rich editing,
              all wrapped in Google Docs-style real-time collaboration
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 hover:border-blue-300/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rich Content Creation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Craft beautiful, structured knowledge posts with our powerful rich text editor.
                Format, style, and organize your ideas exactly as you envision them.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200/50 hover:border-purple-300/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Collaboration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Work together seamlessly with live cursors, instant updates, and synchronized editing.
                Watch knowledge grow as minds connect in real-time.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200/50 hover:border-emerald-300/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Open & Accessible</h3>
              <p className="text-muted-foreground leading-relaxed">
                Knowledge should be free. Browse, discover, and learn from our entire community
                without barriers—no login required to explore.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">Smart Discovery</h4>
                <p className="text-sm text-muted-foreground">Find exactly what you need</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold">Community Driven</h4>
                <p className="text-sm text-muted-foreground">Knowledge by the people</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold">Easy Sharing</h4>
                <p className="text-sm text-muted-foreground">Spread knowledge effortlessly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4">
                Knowledge in{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Motion
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Watch our community's latest contributions unfold. Every post is a doorway
                to new understanding, shared openly for all to explore and build upon.
              </p>
            </div>

            <Link href="/feed">
              <Button size="lg" variant={'gradient'} className="group shadow-lg hover:shadow-xl transition-all">
                Explore All Knowledge
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <LimitedPosts />
        </div>
      </section>

      <section className="py-16 px-4 border-t bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold">Ready to Share Your Knowledge?</h3>
            <p className="text-muted-foreground">
              Join thousands of contributors making knowledge accessible to everyone.
              Your next post could be the breakthrough someone's been looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <CreatePostModal>
                <Button size="lg" className="group" variant={'gradient'}>
                  Start Your First Post
                  <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </CreatePostModal>

              <Link href="/feed">
                <Button variant="outline" size="lg">
                  Browse the Knowledge Base
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}