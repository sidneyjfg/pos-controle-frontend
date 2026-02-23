import { useFetch } from './useFetch';
import { useApi } from './useApi';
import { fairService } from '../services';
import type { Fair, CreateFairDTO, UpdatePriceDTO } from '../types';

export function useFairs() {
  const { data: fairs, loading, error, refetch } = useFetch<Fair[]>(
    () => fairService.getAll()
  );

  const createFair = useApi<Fair>((data: CreateFairDTO) => 
    fairService.create(data)
  );

  const updatePrice = useApi<void>((fairId: string, internalCode: string, data: UpdatePriceDTO) =>
    fairService.updateProductPrice(fairId, internalCode, data)
  );

  const syncFair = useApi<void>((fairId: string) =>
    fairService.sync(fairId)
  );

  return {
    fairs,
    loading,
    error,
    refetch,
    createFair,
    updatePrice,
    syncFair,
  };
}
