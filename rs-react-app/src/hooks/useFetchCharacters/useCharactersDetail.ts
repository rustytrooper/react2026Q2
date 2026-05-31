import { useQuery } from '@tanstack/react-query';
import { charactersApi } from '../../helpers/charactersApi';

export function useCharacterDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersApi.getCharacterById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
