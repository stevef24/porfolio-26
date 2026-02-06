/**
 * Example Scrolly Steps - Demonstrates the typed steps API
 *
 * This file exports a steps array for use with ScrollyCoding.
 * Import this in your MDX file and pass to the component.
 */

import type { ScrollyCodeStep } from "@/lib/scrolly/types";

export const steps = [
	{
		id: "create-state",
		title: "Create the state shape",
		body: (
			<p>
				Start with a minimal state type. Keep it small and easy to reason about
				- you can always expand later.
			</p>
		),
		code: `type State = {
  count: number
}

export const state: State = {
  count: 0
}`,
		lang: "ts",
		file: "state.ts",
		focusLines: [1, 2, 3],
	},
	{
		id: "add-increment",
		title: "Add an increment action",
		body: (
			<p>
				Create a simple function that mutates the state. Keeping mutations in
				one place makes debugging easier.
			</p>
		),
		code: `type State = {
  count: number
}

export const state: State = {
  count: 0
}

export const increment = () => {
  state.count += 1
}`,
		lang: "ts",
		file: "state.ts",
		focusLines: [9, 10, 11],
	},
	{
		id: "add-decrement",
		title: "Add a decrement action",
		body: (
			<p>
				Following the same pattern, add a decrement function. Notice how the
				code evolves incrementally.
			</p>
		),
		code: `type State = {
  count: number
}

export const state: State = {
  count: 0
}

export const increment = () => {
  state.count += 1
}

export const decrement = () => {
  state.count -= 1
}`,
		lang: "ts",
		file: "state.ts",
		focusLines: [13, 14, 15],
	},
	{
		id: "add-reset",
		title: "Add a reset action",
		body: (
			<p>
				Finally, add a reset function to return the counter to zero. This
				completes our minimal state management.
			</p>
		),
		code: `type State = {
  count: number
}

export const state: State = {
  count: 0
}

export const increment = () => {
  state.count += 1
}

export const decrement = () => {
  state.count -= 1
}

export const reset = () => {
  state.count = 0
}`,
		lang: "ts",
		file: "state.ts",
		focusLines: [17, 18, 19],
	},
] satisfies ScrollyCodeStep[];

export const doc = {
	theme: {
		light: "vitesse-light",
		dark: "vitesse-dark",
	},
};
