import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import { useShallowStore } from './useShallowStore';
import { useEffect } from 'react';

/**
 * Custom hook that combines React Query with Zustand for optimized data fetching
 * This provides several performance benefits:
 * 1. Uses cached data from Zustand store when available
 * 2. Updates the Zustand store with fresh data when fetched
 * 3. Provides optimized selectors to prevent unnecessary re-renders
 * 4. Handles offline scenarios by falling back to cached data
 */
export function useOptimizedQuery<TData, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> & {
    cacheInStore?: boolean;
    cacheKeyExtractor?: (data: TData) => string;
  }
): UseQueryResult<TData, TError> {
  // Extract options
  const { 
    cacheInStore = true,
    cacheKeyExtractor,
    ...queryOptions 
  } = options || {};

  // Get relevant state and actions from the app store
  const { 
    isOffline,
    cacheCourse,
    cacheCourses 
  } = useShallowStore(useAppStore, state => ({
    isOffline: state.isOffline,
    cacheCourse: state.cacheCourse,
    cacheCourses: state.cacheCourses
  }));

  // Use React Query with network-aware settings
  const queryResult = useQuery<TData, TError>({
    queryKey,
    queryFn,
    // Don't refetch when offline
    networkMode: isOffline ? 'always' : 'online',
    // Increase stale time for better performance
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Keep cached data longer
    gcTime: 30 * 60 * 1000, // 30 minutes
    // Custom options
    ...queryOptions
  });

  // Cache successful query results in the Zustand store
  useEffect(() => {
    if (cacheInStore && queryResult.data && !queryResult.isError) {
      // Handle array data (like lists of courses)
      if (Array.isArray(queryResult.data) && queryResult.data.length > 0 && 'id' in queryResult.data[0]) {
        cacheCourses(queryResult.data as any);
      } 
      // Handle single item data (like a single course)
      else if (queryResult.data && typeof queryResult.data === 'object' && 'id' in queryResult.data) {
        const item = queryResult.data as any;
        const key = cacheKeyExtractor ? cacheKeyExtractor(queryResult.data) : item.id;
        cacheCourse(key, item);
      }
    }
  }, [queryResult.data, queryResult.isError, cacheInStore, cacheCourse, cacheCourses, cacheKeyExtractor]);

  return queryResult;
}

/**
 * Hook for fetching a single item with optimized caching
 */
export function useOptimizedItemQuery<TData extends { id: string }, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  itemId: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  // Get cached item from store
  const cachedItem = useAppStore(state => state.cachedCourses[itemId]) as TData | undefined;
  
  return useOptimizedQuery<TData, TError>(
    queryKey,
    queryFn,
    {
      ...options,
      // Use cached data if available
      initialData: cachedItem,
      cacheKeyExtractor: (data) => data.id
    }
  );
}
