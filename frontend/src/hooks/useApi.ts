import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

// Example API functions
const api = {
  get: async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
  post: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
};

// Custom hooks
export const useGet = <T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => api.get(url),
    ...options,
  });
};

export const usePost = <T, V>(
  url: string,
  options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
) => {
  return useMutation<T, Error, V>({
    mutationFn: (data) => api.post(url, data),
    ...options,
  });
}; 