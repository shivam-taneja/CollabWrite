import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
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
    </main>
  );
}
