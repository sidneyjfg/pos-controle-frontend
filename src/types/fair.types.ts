export interface Fair {
  FairID: string;
  Name: string;
  IsSynced: boolean;
  SyncedAt?: string;
  ExternalReference?: string;
  Date: string;
  Location?: string;
  IsActive: boolean;
  CreatedAt: string;
}

export interface FairProduct {
  FairProductID: string;
  FairID: string;
  ProductID: number;
  CustomPrice?: number;
  IsActive: boolean;
}

export interface FairSale {
  FairSaleID: string;
  FairID: string;
  ProductID: number;
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
  SaleDate: string;
}

export interface CreateFairDTO {
  Name: string;
  Date: string;
  Location?: string;
}

export interface UpdatePriceDTO {
  CustomPrice: number;
}

export interface SyncFairDTO {
  fairId: string;
}
