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
  FairProductID: number;
  FairID: string;
  ProductID: number;
  SalePrice: number;
  PromotionalPrice?: number;
  InitialStock: number;
  SoldQuantity: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  // Relação com produto
  product?: {
    ProductID: number;
    InternalCode: string;
    Name: string;
    NameEng?: string;
    BarCode?: string;
    SalePrice?: number;
  };
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

export interface AddProductToFairDTO {
  internalCode: string;
  customPrice?: number;
}

export interface UpdateFairProductPriceDTO {
  customPrice: number;
}

export interface SyncFairDTO {
  fairId: string;
}
