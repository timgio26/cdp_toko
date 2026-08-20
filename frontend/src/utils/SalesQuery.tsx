import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getAuthHeaders } from "./myfunction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export interface SalesParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
}

export interface SaleItem {
  id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string;
  product_unit: string;
  quantity: number;
  unit_price: string;
  discount_amount: string;
  gross_total: string;
  total: string;
}

export interface Sale {
  id: string;
  invoice_number: string;

  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;

  subtotal: string;
  item_discount: string;
  order_discount: string;
  tax_amount: string;
  shipping_fee: string;
  service_fee: string;
  total: string;

  payment_method: string;
  status: string;
  created_at: string;

  items: SaleItem[];
}

export interface SalesResponse {
  sales: Sale[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export function useSales(params: SalesParams = {}) {
  const {
    page = 1,
    per_page = 20,
    search = "",
    status,
    payment_method,
    date_from,
    date_to,
  } = params;

  const { data, isPending, isError, error } = useQuery<SalesResponse>({
    queryKey: [
      "sales",
      {
        page,
        per_page,
        search,
        status,
        payment_method,
        date_from,
        date_to,
      },
    ],

    queryFn: async () => {
      const resp = await axios.get<SalesResponse>("/api/sales/", {
        headers: getAuthHeaders(),
        params: {
          page,
          per_page,
          search: search || undefined,
          status: status || undefined,
          payment_method: payment_method || undefined,
          date_from: date_from || undefined,
          date_to: date_to || undefined,
        },
      });

      return resp.data;
    },
  });

  return {
    sales: data?.sales ?? [],

    pagination: data?.pagination ?? {
      page: 1,
      per_page,
      total: 0,
      pages: 0,
      has_next: false,
      has_previous: false,
    },

    isPending,
    isError,
    error,
  };
}

// ... your existing types

export interface CreateSaleItem {
  product_id: string;
  quantity: number;
  unit_price: number | string;
  discount_amount: number | string;
}

export interface CreateSalePayload {
  // invoice_number: string;

  customer_id?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;

  order_discount?: number | string;
  tax_amount?: number | string;
  shipping_fee?: number | string;
  service_fee?: number | string;

  payment_method: string;

  items: CreateSaleItem[];
}

export interface CreateSaleResponse {
  message: string;
  sale: Sale;
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createInvoice, isPending } = useMutation({
    mutationFn: async (payload: CreateSalePayload) => {
      const response = await axios.post<CreateSaleResponse>(
        "/api/sales/",
        payload,
        {
          headers: getAuthHeaders(),
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
      navigate(`/sales/${data.sale.id}/invoice`);
    },
    onError: (error: any) => {
      toast(error?.response?.data?.error ?? "Failed to create invoice", {
        type: "error",
      });
    },
  });
  return { createInvoice, isPending };
}

export function useSale(saleId?: string) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [saleId],

    queryFn: async () => {
      // console.log("trying")
      const response = await axios.get<Sale>(`/api/sales/${saleId}/invoice`, {
        headers: getAuthHeaders(),
      });
      // console.log(response.data)
      return response.data;
    },

    enabled: Boolean(saleId),
  });
  return {
    data,
    isPending,
    isError,
    error,
  };
}

export function useCancelSale() {
  const queryClient = useQueryClient();

  const cancelSaleMutation = useMutation({
    mutationFn: async (saleId: string) => {
      const response = await axios.delete(`/api/sales/${saleId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },

    onSuccess: () => {
      toast.success("Invoice cancelled successfully");

      // Refresh sales list
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });

      // If you have an individual sale query
      queryClient.invalidateQueries({
        queryKey: ["sale"],
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.error || "Failed to cancel invoice";

      toast.error(message);
    },
  });

  return {
    cancelSale: cancelSaleMutation.mutate,
    isCancelling: cancelSaleMutation.isPending,
  };
}

export interface SalesDashboard {
  summary: {
    today: {
      orders: number;
      revenue: string;
    };
    month: {
      orders: number;
      revenue: string;
      average_order_value: string;
    };
  };

  payment_methods: {
    method: string;
    orders: number;
    revenue: string;
  }[];

  top_products: {
    product_id: string | null;
    name: string;
    sku: string;
    quantity: number;
    revenue: string;
  }[];

  daily_sales: {
    date: string;
    orders: number;
    revenue: string;
  }[];

  recent_sales: {
    id: string;
    invoice_number: string;
    customer_name: string | null;
    total: string;
    payment_method: string;
    created_at: string | null;
  }[];
}

export function useSalesDashboard() {
  return useQuery({
    queryKey: ["sales-dashboard"],

    queryFn: async () => {
      try {
        const { data } = await axios.get<SalesDashboard>(
          "/api/dashboard/sales",
          {
            headers: getAuthHeaders(),
          },
        );

        return data;
      } catch (error) {
        toast.error("Failed to load sales dashboard");
        throw error;
      }
    },

    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}