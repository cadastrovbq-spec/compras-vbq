
export interface Supplier {
  id: string;
  name: string;
  taxId: string;
  contact: string;
  vendorName?: string;
  vendorPhone?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  unit: string; // kg, un, l, cx, fardo, etc.
}

export interface Receipt {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  date: string;
}

export interface DailySale {
  id: string;
  totalValue: number;
  date: string;
  notes?: string;
}

export interface Boleto {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  status: 'pending' | 'paid';
  categoryId: string;
}

export interface MaintenanceRecord {
  id: string;
  description: string;
  supplierId: string;
  date: string;
  value: number;
}

export interface FixedCost {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  status: 'pending' | 'paid';
}

export type ViewType = 'dashboard' | 'suppliers' | 'products' | 'receipts' | 'sales' | 'categories' | 'reports' | 'boletos' | 'notas_lancadas' | 'manutencao' | 'custos_fixos';
export type StoreUnit = 'loja1' | 'loja2';
