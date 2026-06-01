import { useQuery } from '@tanstack/react-query';
import { charactersApi } from '../../helpers/charactersApi';
import { cashTTL } from '../../main';

export function useCharacterDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersApi.getCharacterById(id!),
    enabled: !!id,
    staleTime: cashTTL,
    retry: 1,
  });
}
