import { useFetch } from "./useFetch";
import { useApi } from "./useApi";
import { productService } from "../services";
import type { Product, CreateProductDTO, PaginatedResponse } from "../types";

export function useProducts(page = 1, limit = 10, search = "") {

  const { data, loading, error, refetch } = useFetch<PaginatedResponse<Product>>(
    () => productService.getAll(page, limit, search),
    { deps: [page, limit, search] }
  );

  const createProduct = useApi<Product>((data: CreateProductDTO) =>
    productService.create(data)
  );

  const deleteProduct = useApi<void>((id: number) =>
    productService.delete(id)
  );

  return {
    products: data?.data || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch,
    createProduct,
    deleteProduct
  };
}
