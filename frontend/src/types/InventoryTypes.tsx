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
  category_name?: string;
  suppliers: ProductSupplier[];
};

export type CategoryData = {
  id: string;
  name: string;
};

export type SupplierData = {
  id: string;
  name: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
};