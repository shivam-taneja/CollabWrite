import Link from "next/link";

import { mockPosts } from "@/utils/constants";

import PostCard from "@/components/home/post-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";

export default function Home() {
  const featuredPosts = mockPosts.slice(0, 3)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:py-32 hero-gradient">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Share Knowledge,{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Build Together
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              CollabWrite is where ideas come to life. Create, collaborate, and discover
              knowledge posts from a community of passionate writers and learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link href="/feed">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Explore Posts
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Start Writing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose CollabWrite?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to share your knowledge and learn from others
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Rich Content</h3>
              <p className="text-muted-foreground">
                Create beautiful posts with our rich text editor. Format your content
                exactly how you want it.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Collaborate</h3>
              <p className="text-muted-foreground">
                Work together with other writers. Real-time collaboration makes
                knowledge sharing seamless.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Discover</h3>
              <p className="text-muted-foreground">
                Explore posts across categories. Find exactly what you're looking
                for with smart filtering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Posts</h2>
              <p className="text-muted-foreground">
                Discover the latest knowledge shared by our community
              </p>
            </div>
            <Link href="/feed">
              <Button variant="outline">
                View All Posts
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
