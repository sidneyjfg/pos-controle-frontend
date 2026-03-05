export interface Product {
  ProductID: number;
  InternalCode: string;
  Name?: string | null;
  NameEng?: string | null;
  BarCode?: string | null;
  SalePrice?: number | null;
  ProductGroupID: string;
  ProductTypeID: string;
  UnitTypeID: string;
  StatusID: string;
  NFCeNCM?: string | null;
  NFCeCFOP?: string | null;
  NFCeCST?: string | null;
  NFCeCEST?: string | null;
  NFCeAliqICMS?: number | null;
  NFCeCSTPIS?: string | null;
  NFCeAliqPIS?: number | null;
  NFCeCSTCOFINS?: string | null;
  NFCeAliqCOFINS?: number | null;
  ExternalID?: string | null;
  CreatedAt?: string;
  UpdatedAt?: string;
  // Campo não persistido no banco (apenas para upload de imagem)
  ImageBase64?: string;
}

export interface ProductType {
  ProductTypeID: number;
  Name: string;
  ExternalID: string
}

export interface ProductGroup {
  ProductGroupID: number;
  Name: string;
  ExternalID: string;
}

export interface UnitType {
  UnitTypeID: number;
  Name: string;
  Abbreviation: string;
  ExternalID: string;
}

export interface Status {
  StatusID: number;
  Name: string;
  ExternalID: string;
}

export interface CreateProductDTO {
  Name: string;
  NameEng?: string | null;
  InternalCode: string;
  BarCode?: string | null;
  SalePrice: number; // Obrigatório
  ProductGroupID: string; // Obrigatório
  UnitTypeID: string; // Obrigatório
  ProductTypeID: string;
  StatusID: string;
  ImageBase64?: string;
  NFCeNCM?: string | null;
  NFCeCFOP?: string | null;
  NFCeCST?: string | null;
  NFCeCEST?: string | null;
  NFCeAliqICMS?: number | null;
  NFCeCSTPIS?: string | null;
  NFCeAliqPIS?: number | null;
  NFCeCSTCOFINS?: string | null;
  NFCeAliqCOFINS?: number | null;
}
