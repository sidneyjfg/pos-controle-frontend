/**
 * Utilitários de validação de produto
 * Mesmas regras do backend para validação em tempo real
 */

export interface ValidationError {
  field: string;
  message: string;
}

export const validateProductName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "Nome é obrigatório";
  }
  if (name.length > 40) {
    return "Nome deve ter no máximo 40 caracteres";
  }
  return null;
};

export const validateInternalCode = (code: string): string | null => {
  if (!code || code.trim().length === 0) {
    return "Código interno é obrigatório";
  }
  return null;
};

export const validateSalePrice = (price: number | null | undefined): string | null => {
  if (price === null || price === undefined || price === 0) {
    return "Preço é obrigatório e deve ser maior que zero";
  }
  if (price < 0.01) {
    return "Preço deve ser no mínimo R$ 0,01";
  }
  return null;
};

export const validateNCM = (ncm: string): string | null => {
  if (!ncm || ncm.trim().length === 0) {
    return "NCM é obrigatório";
  }
  if (!/^\d{8}$/.test(ncm)) {
    return "NCM deve ter exatamente 8 dígitos";
  }
  return null;
};

export const validateCFOP = (cfop: string): string | null => {
  if (!cfop || cfop.trim().length === 0) {
    return "CFOP é obrigatório";
  }
  if (!/^\d{4}$/.test(cfop)) {
    return "CFOP deve ter exatamente 4 dígitos";
  }
  return null;
};

export const validateCSTICMS = (cst: string): string | null => {
  if (!cst || cst.trim().length === 0) {
    return "CST ICMS é obrigatório";
  }
  if (!/^\d{3}$/.test(cst)) {
    return "CST ICMS deve ter exatamente 3 dígitos";
  }
  return null;
};

export const validateCEST = (cest: string | null | undefined, cstICMS: string): string | null => {
  // CEST é obrigatório apenas se CST ICMS = "110"
  if (cstICMS === "110") {
    if (!cest || cest.trim().length === 0) {
      return "CEST é obrigatório quando CST ICMS é 110";
    }
  }
  return null;
};

export const validateCSTPIS = (cstPis: string): string | null => {
  if (!cstPis || cstPis.trim().length === 0) {
    return "CST PIS é obrigatório";
  }
  if (!/^\d{2}$/.test(cstPis)) {
    return "CST PIS deve ter exatamente 2 dígitos";
  }
  return null;
};

export const validateAliqPIS = (aliq: number | null | undefined): string | null => {
  if (aliq === null || aliq === undefined || aliq === 0) {
    return "Alíquota PIS é obrigatória e deve ser maior que zero";
  }
  if (aliq < 0.01) {
    return "Alíquota PIS deve ser no mínimo 0,01";
  }
  if (aliq > 100) {
    return "Alíquota PIS não pode ser maior que 100%";
  }
  return null;
};

export const validateCSTCOFINS = (cstCofins: string): string | null => {
  if (!cstCofins || cstCofins.trim().length === 0) {
    return "CST COFINS é obrigatório";
  }
  if (!/^\d{2}$/.test(cstCofins)) {
    return "CST COFINS deve ter exatamente 2 dígitos";
  }
  return null;
};

export const validateAliqCOFINS = (aliq: number | null | undefined): string | null => {
  if (aliq === null || aliq === undefined || aliq === 0) {
    return "Alíquota COFINS é obrigatória e deve ser maior que zero";
  }
  if (aliq < 0.01) {
    return "Alíquota COFINS deve ser no mínimo 0,01";
  }
  if (aliq > 100) {
    return "Alíquota COFINS não pode ser maior que 100%";
  }
  return null;
};

/**
 * Valida todos os campos obrigatórios do produto
 */
export const validateProduct = (product: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Campos básicos
  const nameError = validateProductName(product.Name);
  if (nameError) errors.push({ field: 'Name', message: nameError });

  const codeError = validateInternalCode(product.InternalCode);
  if (codeError) errors.push({ field: 'InternalCode', message: codeError });

  const priceError = validateSalePrice(product.SalePrice);
  if (priceError) errors.push({ field: 'SalePrice', message: priceError });

  // Campos NFCe
  const ncmError = validateNCM(product.NFCeNCM);
  if (ncmError) errors.push({ field: 'NFCeNCM', message: ncmError });

  const cfopError = validateCFOP(product.NFCeCFOP);
  if (cfopError) errors.push({ field: 'NFCeCFOP', message: cfopError });

  const cstError = validateCSTICMS(product.NFCeCST);
  if (cstError) errors.push({ field: 'NFCeCST', message: cstError });

  const cestError = validateCEST(product.NFCeCEST, product.NFCeCST);
  if (cestError) errors.push({ field: 'NFCeCEST', message: cestError });

  const cstPisError = validateCSTPIS(product.NFCeCSTPIS);
  if (cstPisError) errors.push({ field: 'NFCeCSTPIS', message: cstPisError });

  const aliqPisError = validateAliqPIS(product.NFCeAliqPIS);
  if (aliqPisError) errors.push({ field: 'NFCeAliqPIS', message: aliqPisError });

  const cstCofinsError = validateCSTCOFINS(product.NFCeCSTCOFINS);
  if (cstCofinsError) errors.push({ field: 'NFCeCSTCOFINS', message: cstCofinsError });

  const aliqCofinsError = validateAliqCOFINS(product.NFCeAliqCOFINS);
  if (aliqCofinsError) errors.push({ field: 'NFCeAliqCOFINS', message: aliqCofinsError });

  return errors;
};
