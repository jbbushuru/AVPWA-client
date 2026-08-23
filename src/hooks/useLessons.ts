import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLessons } from '../services/lessonService';

export const useLessons = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['allLessons'],
    queryFn: async () => {
      const data: any = await getLessons();
      return data.lessons || data || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const invalidateLessons = () => {
    queryClient.invalidateQueries({ queryKey: ['allLessons'] });
  };

  return { ...query, invalidateLessons };
};
