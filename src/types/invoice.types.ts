export interface Invoice {
  saleId: string;
  saleStatus: string;
  accessKey: string;
  nfceId: string;
  numero: string;
  serie: string;
  datetimeSale: string;
  xmlAutUrl?: string | null;
  xmlCancUrl?: string | null;
  xml?: string | null;
}

export interface InvoicePage {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Invoice[];
}

export interface SalesSyncResult {
  syncedCount: number;
  totalReceived: number;
}
