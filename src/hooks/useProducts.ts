import { useFetch } from './useFetch';
import { useApi } from './useApi';
import { productService } from '../services';
import type { Product, CreateProductDTO } from '../types';

export function useProducts() {
  const { data: products, loading, error, refetch } = useFetch<Product[]>(
    () => productService.getAll()
  );

  const createProduct = useApi<Product>((data: CreateProductDTO) => 
    productService.create(data)
  );

  const deleteProduct = useApi<void>((id: number) => 
    productService.delete(id)
  );

  return {
    products,
    loading,
    error,
    refetch,
    createProduct,
    deleteProduct,
  };
}
