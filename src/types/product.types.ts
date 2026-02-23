export interface Product {
  ProductID: number;
  StatusID?: number;
  ProductGroupID?: number;
  ProductTypeID?: number;
  UnitTypeID?: number;
  Name?: string;
  NameEng?: string;
  InternalCode: string;
  BarCode?: string;
  ImageBase64?: string;
  NFCeNCM?: string;
  NFCeCFOP?: string;
  NFCeCST?: string;
  NFCeCEST?: string;
  NFCeAliqICMS?: number;
  SalePrice?: number;
  NFCeCSTPIS?: string;
  NFCeAliqPIS?: number;
  NFCeCSTCOFINS?: string;
  NFCeAliqCOFINS?: number;
}

export interface ProductType {
  ProductTypeID: number;
  Name: string;
}

export interface ProductGroup {
  ProductGroupID: number;
  Name: string;
}

export interface UnitType {
  UnitTypeID: number;
  Name: string;
  Abbreviation: string;
}

export interface Status {
  StatusID: number;
  Name: string;
}

export interface CreateProductDTO {
  Name: string;
  NameEng?: string;
  InternalCode: string;
  BarCode?: string;
  SalePrice?: number;
  ProductGroupID?: number;
  ProductTypeID?: number;
  UnitTypeID?: number;
  StatusID?: number;
  ImageBase64?: string;
  NFCeNCM?: string;
  NFCeCFOP?: string;
  NFCeCST?: string;
  NFCeCEST?: string;
  NFCeAliqICMS?: number;
  NFCeCSTPIS?: string;
  NFCeAliqPIS?: number;
  NFCeCSTCOFINS?: string;
  NFCeAliqCOFINS?: number;
}
