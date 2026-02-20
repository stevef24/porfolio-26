export interface Experiment {
  slug: string;
  title: string;
  description: string;
  preview: {
    type: "video" | "gif" | "image";
    src: string;
    poster?: string;
  };
  tech: Array<{
    name: string;
    category: "library" | "api" | "tool";
    url?: string;
  }>;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  body: string;
}

export const experiments: Experiment[] = [
  {
    slug: "hold-to-confirm",
    title: "Hold to Confirm",
    description:
      "A hold-to-confirm button that requires the user to press and hold before the action fires — prevents accidental destructive actions with satisfying tactile feedback.",
    preview: {
      type: "gif",
      src: "/experiments/preview/hold-to-confirm.gif",
    },
    tech: [
      { name: "Motion", category: "library", url: "https://motion.dev" },
      { name: "React", category: "library", url: "https://react.dev" },
    ],
    tags: ["interaction", "animation", "ux"],
    body: "Hold-to-confirm adds a deliberate friction to destructive actions (delete, purchase, send). The button fills a progress arc on hold and cancels cleanly on release, giving users the confidence that accidental taps won't cost them.",
  },
  {
    slug: "view-transitions",
    title: "View Transitions API",
    description:
      "Smooth page-to-page morphing using the native View Transitions API with shared element transitions between list and detail views.",
    preview: {
      type: "image",
      src: "/experiments/preview/view-transitions.webp",
    },
    tech: [
      {
        name: "View Transitions API",
        category: "api",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API",
      },
      { name: "Next.js", category: "tool", url: "https://nextjs.org" },
      { name: "Motion", category: "library", url: "https://motion.dev" },
    ],
    tags: ["animation", "navigation", "api"],
    body: "The View Transitions API enables smooth animated transitions between page states without any JavaScript animation library. By assigning matching `view-transition-name` values to elements across two pages, the browser automatically morphs between them using CSS animations.",
  },
  {
    slug: "anime-stagger",
    title: "Anime.js Stagger Grid",
    description:
      "CSS grid entrance animation using Anime.js stagger for a cascade reveal effect with precise easing control.",
    preview: {
      type: "image",
      src: "/experiments/preview/anime-stagger.webp",
    },
    tech: [
      { name: "Anime.js", category: "library", url: "https://animejs.com" },
      { name: "React", category: "library", url: "https://react.dev" },
    ],
    tags: ["animation", "layout"],
    body: "Anime.js v4 provides a lightweight API for staggered entrance animations. Using `stagger()` with `delay`, each card in the grid animates in sequence with a natural cascade feel.",
  },
];
