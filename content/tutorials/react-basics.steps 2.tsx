/**
 * React Basics Steps - Component evolution walkthrough
 *
 * Shows the progression from a basic component to a fully typed,
 * stateful React component using TypeScript.
 */

import type { ScrollyCodeStep } from "@/lib/scrolly/types";

export const reactBasicsSteps: ScrollyCodeStep[] = [
	{
		id: "basic-component",
		title: "Start with a basic component",
		body: "Every React component is a function that returns JSX. Start simple and add complexity only when needed.",
		code: `function Button() {
  return (
    <button className="px-4 py-2 rounded-lg bg-blue-500 text-white">
      Click me
    </button>
  )
}

export default Button`,
		lang: "tsx",
		file: "Button.tsx",
		focusLines: [1, 2, 3, 4, 5, 6],
	},
	{
		id: "add-props",
		title: "Add TypeScript props",
		body: "Define an interface for your component's props. TypeScript catches prop mismatches at compile time, not runtime.",
		code: `interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary'
}

function Button({ label, variant = 'primary' }: ButtonProps) {
  const styles = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
  }

  return (
    <button className={\`px-4 py-2 rounded-lg \${styles[variant]}\`}>
      {label}
    </button>
  )
}

export default Button`,
		lang: "tsx",
		file: "Button.tsx",
		focusLines: [1, 2, 3, 4, 6],
	},
	{
		id: "add-state",
		title: "Add interactive state",
		body: "Use the useState hook for local component state. The component re-renders automatically when state changes.",
		code: `import { useState } from 'react'

interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary'
}

function Button({ label, variant = 'primary' }: ButtonProps) {
  const [clicks, setClicks] = useState(0)

  const styles = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
  }

  return (
    <button
      className={\`px-4 py-2 rounded-lg \${styles[variant]}\`}
      onClick={() => setClicks(c => c + 1)}
    >
      {label} ({clicks})
    </button>
  )
}

export default Button`,
		lang: "tsx",
		file: "Button.tsx",
		focusLines: [1, 9, 19, 21],
	},
];
