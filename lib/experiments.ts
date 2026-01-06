export type Experiment = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  tutorialUrl?: string;
};

export const experiments: Experiment[] = [];

export function getExperiment(id: string): Experiment | undefined {
  return experiments.find((e) => e.id === id);
}
