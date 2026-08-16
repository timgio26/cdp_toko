import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export type Pagination = {
  page: number;
  per_page: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export type Category = {
  id: string;
  name: string;
  product_count?: number;
};

export type CategoriesResponse = {
  items: Category[];
  pagination: Pagination;
};

export type NewCategoryDto = {
  name: string;
};

export type UpdateCategoryDto = {
  name: string;
};

const categoryQueryKey = ["categories"];

function getAuthHeaders() {
  const token = sessionStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Get all categories
 */
export function useCategories(page = 1, perPage = 10) {
  const { data, isPending, isError, error } = useQuery<CategoriesResponse>({
    queryKey: [...categoryQueryKey, page, perPage],

    queryFn: async () => {
      const resp = await axios.get("/api/categories/", {
        headers: getAuthHeaders(),
        params: {
          page,
          per_page: perPage,
        },
      });

      return resp.data;
    },
  });

  return {
    categories: data?.items ?? [],
    pagination: data?.pagination,
    isPending,
    isError,
    error,
  };
}

/**
 * Create category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: async (data: NewCategoryDto) => {
      const resp = await axios.post("/api/categories/", data, {
        headers: getAuthHeaders(),
      });

      return resp.data as Category;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKey,
      });

      toast("Category created successfully", {
        type: "success",
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.error ?? "Failed to create category";

      toast(message, {
        type: "error",
      });
    },
  });

  return {
    createCategory,
    isPending,
  };
}

/**
 * Update category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  const { mutate: updateCategory, isPending } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryDto;
    }) => {
      const resp = await axios.put(`/api/categories/${id}`, data, {
        headers: getAuthHeaders(),
      });

      return resp.data as Category;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKey,
      });

      toast("Category updated successfully", {
        type: "success",
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.error ?? "Failed to update category";

      toast(message, {
        type: "error",
      });
    },
  });

  return {
    updateCategory,
    isPending,
  };
}

/**
 * Delete category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  const { mutate: deleteCategory, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axios.delete(`/api/categories/${id}`, {
        headers: getAuthHeaders(),
      });

      return resp.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKey,
      });

      toast("Category deleted successfully", {
        type: "success",
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.error ?? "Failed to delete category";

      toast(message, {
        type: "error",
      });
    },
  });

  return {
    deleteCategory,
    isPending,
  };
}

export type SupplierData = {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  product_count?: number;
};

export type SuppliersResponse = {
  items: SupplierData[];
  pagination: Pagination;
};

export function useSuppliers(page = 1, perPage = 10) {
  const { data, isPending, isError, error } = useQuery<SuppliersResponse>({
    queryKey: ["suppliers",page,perPage],
    queryFn: async () => {
      const resp = await axios.get("/api/suppliers/", {
        headers: getAuthHeaders(),
        params: {
          page,
          per_page: perPage,
        },
      });

      return resp.data;
    },
  });

  return {
    suppliers: data?.items ?? [],
    pagination: data?.pagination,
    isPending,
    isError,
    error,
  };
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  const { mutate: createSupplier, isPending } = useMutation({
    mutationFn: async (data: {
      name: string;
      contact_person: string | null;
      phone: string | null;
      email: string | null;
    }) => {
      const resp = await axios.post("/api/suppliers/", data, {
        headers: getAuthHeaders(),
      });

      return resp.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      toast("Supplier created successfully", {
        type: "success",
      });
    },

    onError: (error: any) => {
      toast(error?.response?.data?.error ?? "Failed to create supplier", {
        type: "error",
      });
    },
  });

  return {
    createSupplier,
    isPending,
  };
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  const { mutate: updateSupplier, isPending } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name: string;
        contact_person: string | null;
        phone: string | null;
        email: string | null;
      };
    }) => {
      const resp = await axios.put(`/api/suppliers/${id}`, data, {
        headers: getAuthHeaders(),
      });

      return resp.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      toast("Supplier updated successfully", {
        type: "success",
      });
    },

    onError: (error: any) => {
      toast(error?.response?.data?.error ?? "Failed to update supplier", {
        type: "error",
      });
    },
  });

  return {
    updateSupplier,
    isPending,
  };
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  const { mutate: deleteSupplier, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axios.delete(`/api/suppliers/${id}`, {
        headers: getAuthHeaders(),
      });

      return resp.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      toast("Supplier deleted successfully", {
        type: "success",
      });
    },

    onError: (error: any) => {
      toast(error?.response?.data?.error ?? "Failed to delete supplier", {
        type: "error",
      });
    },
  });

  return {
    deleteSupplier,
    isPending,
  };
}

export type ProductSupplier = {
  id: string;
  name: string;
};

export type ProductData = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  category_id: string;
  category_name: string | null;
  suppliers: ProductSupplier[];
};

export type CreateProductDto = {
  name: string;
  sku: string;
  //   quantity: number;
  unit: string;
  price_per_unit: number;
  category_id: string;
  supplier_ids: string[];
};

export type UpdateProductDto = {
  name?: string;
  sku?: string;
  quantity?: number;
  unit?: string;
  price_per_unit?: number;
  category_id?: string;
  supplier_ids?: string[];
};

interface ProductsResponse {
  items: ProductData[];
  pagination: Pagination;
}

// =========================================================
// GET PRODUCTS
// =========================================================

export function useProducts(
  page = 1,
  perPage = 10,
  search = ""
) {
  const token = sessionStorage.getItem("token");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", page, perPage, search],
    queryFn: async () => {
      const response = await axios.get<ProductsResponse>("/api/products/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          per_page: perPage,
          search: search || undefined,
        },
      });
      return response.data;
    },
    
  });
  return {
    products: data?.items ?? [],
    pagination: data?.pagination,
    isPending,
    isError,
    error,
  };
}

// =========================================================
// GET SINGLE PRODUCT
// =========================================================

export function useProduct(id: string | null) {
  const token = sessionStorage.getItem("token");

  const query = useQuery({
    queryKey: ["product", id],
    enabled: Boolean(id),

    queryFn: async () => {
      const response = await axios.get<ProductData>(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });

  return {
    ...query,
    product: query.data ?? null,
  };
}

// =========================================================
// CREATE PRODUCT
// =========================================================

export function useCreateProduct() {
  const queryClient = useQueryClient();

  const token = sessionStorage.getItem("token");

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: async (data: CreateProductDto) => {
      const response = await axios.post("/api/products/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast("Product created successfully", {
        type: "success",
      });
    },

    onError: (error: any) => {
      toast(error?.response?.data?.error ?? "Failed to create product", {
        type: "error",
      });
    },
  });

  return {
    createProduct,
    isPending,
  };
}

// =========================================================
// UPDATE PRODUCT
// =========================================================

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  const token = sessionStorage.getItem("token");

  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductDto;
    }) => {
      const response = await axios.put(`/api/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", variables.id],
      });

      toast("Product updated successfully", {
        type: "success",
      });
    },

    onError: (error: any) => {
      toast(error?.response?.data?.error ?? "Failed to update product", {
        type: "error",
      });
    },
  });

  return {
    updateProduct,
    isPending,
  };
}

// =========================================================
// DELETE PRODUCT
// =========================================================

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const token = sessionStorage.getItem("token");

  const { mutate: deleteProduct, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast("Product deleted successfully", {
        type: "success",
      });
    },

    onError: (error: any) => {
      toast(error?.response?.data?.error ?? "Failed to delete product", {
        type: "error",
      });
    },
  });

  return {
    deleteProduct,
    isPending,
  };
}

export interface StockMovement {
  id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity_before: number;
  quantity_change: number;
  quantity_after: number;
  reason: string;
  created_at: string;
  can_edit: boolean;
  can_delete: boolean;
}

interface StockMovementsResponse {
  data: StockMovement[];
}

export function useStockMovements() {
  const { data, isPending, isError, error } = useQuery<StockMovementsResponse>({
    queryKey: ["stock-movements"],

    queryFn: async () => {
      const resp = await axios.get<StockMovementsResponse>(
        "/api/stock-movements/",
        {
          headers: getAuthHeaders(),
        },
      );

      return resp.data;
    },
  });

  return {
    stockMovements: data?.data ?? [],
    isPending,
    isError,
    error,
  };
}

export function useDeleteStockMovement() {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (movementId: string) => {
      await axios.delete(`/api/stock-movements/${movementId}`, {
        headers: getAuthHeaders(),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-movements"],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ?? "Failed to delete stock movement";

      toast(message, {
        type: "error",
      });
    },
  });

  return {
    deleteStockMovement: mutate,
    isPending,
    isError,
    error,
  };
}

export interface CreateStockMovementData {
  product_id: string;
  quantity_change: number;
  reason: string;
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateStockMovementData) => {
      const resp = await axios.post("/api/stock-movements/", data, {
        headers: getAuthHeaders(),
      });

      return resp.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-movements"],
      });

      // If your product list displays current stock,
      // invalidate that query too.
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error: any) => {
      toast(error?.response?.data?.error ?? "Failed to delete product", {
        type: "error",
      });
    },
  });

  return {
    createStockMovement: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
