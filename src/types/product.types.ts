export interface Product {
  ProductID: number;
  InternalCode: string;
  Name?: string | null;
  NameEng?: string | null;
  BarCode?: string | null;
  SalePrice?: number | null;
  ProductGroupID?: number | null;
  ProductTypeID?: number | null;
  UnitTypeID?: number | null;
  StatusID?: number | null;
  NFCeNCM?: string | null;
  NFCeCFOP?: string | null;
  NFCeCST?: string | null;
  NFCeCEST?: string | null;
  NFCeAliqICMS?: number | null;
  NFCeCSTPIS?: string | null;
  NFCeAliqPIS?: number | null;
  NFCeCSTCOFINS?: string | null;
  NFCeAliqCOFINS?: number | null;
  ExternalReference?: string | null;
  CreatedAt?: string;
  UpdatedAt?: string;
  // Campo não persistido no banco (apenas para upload de imagem)
  ImageBase64?: string;
}

export interface ProductType {
  ProductTypeID: number;
  Name: string;
  ExternalReference?: string | null;
}

export interface ProductGroup {
  ProductGroupID: number;
  Name: string;
  ExternalReference?: string | null;
}

export interface UnitType {
  UnitTypeID: number;
  Name: string;
  Abbreviation: string;
  ExternalReference?: string | null;
}

export interface Status {
  StatusID: number;
  Name: string;
  ExternalReference?: string | null;
}

export interface CreateProductDTO {
  Name: string;
  NameEng?: string | null;
  InternalCode: string;
  BarCode?: string | null;
  SalePrice: number; // Obrigatório
  ProductGroupID: number; // Obrigatório
  UnitTypeID: number; // Obrigatório
  ProductTypeID?: number | null;
  StatusID?: number | null;
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
