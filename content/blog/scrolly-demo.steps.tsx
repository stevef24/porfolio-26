/**
 * Scrolly Demo Steps - Interactive state management walkthrough
 *
 * Import these steps in your MDX file and pass to the Scrolly component.
 */

import type { ScrollyCodeStep } from "@/lib/scrolly/types";

export const stateManagementSteps: ScrollyCodeStep[] = [
	{
		id: "initial-state",
		title: "Define the state shape",
		body: "Start with a minimal state type. Keep it small and easy to reason about - you can always expand later. TypeScript ensures we catch shape mismatches at compile time.",
		code: `interface CounterState {
  count: number
}

const initialState: CounterState = {
  count: 0
}`,
		lang: "ts",
		file: "store.ts",
		focusLines: [1, 2, 3],
	},
	{
		id: "add-actions",
		title: "Create action types",
		body: "Define your actions as a discriminated union. This pattern gives you exhaustive type checking in reducers and excellent IDE autocomplete.",
		code: `interface CounterState {
  count: number
}

const initialState: CounterState = {
  count: 0
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }`,
		lang: "ts",
		file: "store.ts",
		focusLines: [9, 10, 11, 12],
	},
	{
		id: "implement-reducer",
		title: "Implement the reducer",
		body: "The reducer is a pure function that takes state and action, returning new state. TypeScript's exhaustive checking ensures every action is handled.",
		code: `interface CounterState {
  count: number
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }

function reducer(
  state: CounterState,
  action: Action
): CounterState {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    case 'RESET':
      return { count: 0 }
  }
}`,
		lang: "ts",
		file: "store.ts",
		focusLines: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
	},
	{
		id: "create-store",
		title: "Wire up the store",
		body: "Create a simple store that holds state and notifies subscribers on changes. This is the core pattern behind Redux, Zustand, and similar libraries.",
		code: `interface CounterState {
  count: number
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }

function reducer(
  state: CounterState,
  action: Action
): CounterState {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    case 'RESET':
      return { count: 0 }
  }
}

function createStore() {
  let state: CounterState = { count: 0 }
  const listeners = new Set<() => void>()

  return {
    getState: () => state,
    dispatch: (action: Action) => {
      state = reducer(state, action)
      listeners.forEach(fn => fn())
    },
    subscribe: (fn: () => void) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    }
  }
}`,
		lang: "ts",
		file: "store.ts",
		focusLines: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
	},
];
