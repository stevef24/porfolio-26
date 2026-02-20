import { notFound } from "next/navigation";
import { experiments } from "@/data/experiments";
import { ExperimentDetail } from "@/components/experiments/ExperimentDetail";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const experiment = experiments.find((e) => e.slug === slug);
  if (!experiment) return {};
  return {
    title: experiment.title,
    description: experiment.description,
  };
}

export function generateStaticParams() {
  return experiments.map((e) => ({ slug: e.slug }));
}

export default async function ExperimentPage({ params }: PageProps) {
  const { slug } = await params;
  const experiment = experiments.find((e) => e.slug === slug);
  if (!experiment) notFound();

  return (
    <div className="min-h-svh flex flex-col bg-transparent">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>
      <Header />

      <main
        id="main-content"
        className="flex-1 px-6 md:px-10 lg:px-16 py-12 lg:py-16 pb-28"
      >
        <div className="max-w-5xl">
          <Link
            href="/experiments"
            className="inline-flex items-center gap-1.5 text-swiss-caption text-foreground/50 hover:text-foreground transition-colors mb-10 no-underline"
          >
            &larr; Experiments
          </Link>

          <ExperimentDetail experiment={experiment} />
        </div>
      </main>
    </div>
  );
}
