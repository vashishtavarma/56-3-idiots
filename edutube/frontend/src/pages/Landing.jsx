import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * Landing page: hero, scroll-driven animation placeholder (WebP frames),
 * and Sign up link at top right. Used when opening from extension "Sign up" flow.
 */
const Landing = () => {
  const scrollSectionRef = useRef(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header: logo left, Sign up top right */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-xl font-semibold text-foreground hover:text-primary"
          >
            EduTube
          </Link>
          <Link
            to="/auth?tab=signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your learning journey, one step at a time
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Create journeys from playlists, track progress, and take notes—all in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auth"
              className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign in
            </Link>
            <Link
              to="/auth?tab=signup"
              className="rounded-lg border border-border bg-transparent px-6 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll-driven animation section: placeholder for WebP frames */}
      <section
        ref={scrollSectionRef}
        className="relative min-h-[80vh] overflow-hidden border-b border-border"
        aria-label="Scroll animation"
      >
        <div className="sticky top-0 flex min-h-[80vh] items-center justify-center px-4 py-16">
          {/* Placeholder for WebP frame sequence; replace with your frames and scroll-linked animation */}
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="h-48 w-64 rounded-xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                WebP frames / scroll animation
              </span>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Add your WebP frame sequence here and drive it with scroll (e.g.{" "}
              <code className="rounded bg-muted px-1 text-foreground">
                animation-timeline: scroll()
              </code>
              ) or a scroll-based frame index.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to start?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign up and create your first journey in seconds.
          </p>
          <Link
            to="/auth?tab=signup"
            className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign up
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
