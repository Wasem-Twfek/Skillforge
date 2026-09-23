import { useRef } from 'react';
import { shallow } from 'zustand/shallow';
import type { StoreApi, UseBoundStore } from 'zustand';

/**
 * Custom hook for optimized Zustand state selection
 * This hook helps prevent unnecessary re-renders by using shallow comparison
 * @param store The Zustand store
 * @param selector The selector function to extract specific state values
 * @returns The selected state values
 */
export function useShallowStore<StateType, Result>(
  store: UseBoundStore<StoreApi<StateType>>,
  selector: (state: StateType) => Result
): Result {
  const selectorRef = useRef(selector);
  
  // Only update the selector reference if the function changes
  // This prevents unnecessary re-renders due to inline function recreation
  if (selector !== selectorRef.current) {
    selectorRef.current = selector;
  }
  
  // Use the selector with shallow comparison
  return store(state => selectorRef.current(state), shallow);
}

/**
 * Helper function to create a selector for multiple state properties
 * @param keys Array of keys to select from the state
 * @returns A selector function that returns an array of the selected values
 */
export function createArraySelector<StateType, K extends keyof StateType>(
  keys: K[]
): (state: StateType) => StateType[K][] {
  return (state: StateType) => keys.map((key) => state[key]);
}

/**
 * Helper function to create a selector for multiple state properties as an object
 * @param keys Array of keys to select from the state
 * @returns A selector function that returns an object with the selected values
 */
export function createObjectSelector<StateType, K extends keyof StateType>(
  keys: K[]
): (state: StateType) => Pick<StateType, K> {
  return (state) => {
    const result = {} as Pick<StateType, K>;
    keys.forEach((key) => {
      result[key] = state[key];
    });
    return result;
  };
}
