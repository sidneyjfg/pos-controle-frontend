/**
 * Utilitários para formatação de valores monetários
 */

/**
 * Formata um número para moeda brasileira (R$)
 * 
 * @param value - Valor numérico
 * @returns String formatada como moeda (ex: "R$ 1.234,56")
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue);
}

/**
 * Formata um número para ter exatamente 2 casas decimais
 * 
 * @param value - Número a ser formatado
 * @returns Número com 2 casas decimais
 */
export function formatToTwoDecimals(value: number | string): number {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return 0;
  }
  
  return Math.round(numValue * 100) / 100;
}

/**
 * Formata um número para string com 2 casas decimais
 * 
 * @param value - Número a ser formatado
 * @returns String formatada com 2 decimais (ex: "14.99")
 */
export function formatToTwoDecimalsString(value: number | string): string {
  const formatted = formatToTwoDecimals(value);
  return formatted.toFixed(2);
}

/**
 * Remove formatação de moeda e retorna número
 * 
 * @param value - String formatada como moeda (ex: "R$ 1.234,56")
 * @returns Número decimal (ex: 1234.56)
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove "R$", espaços, pontos de milhar
  const cleaned = value
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  const numValue = parseFloat(cleaned);
  
  return isNaN(numValue) ? 0 : formatToTwoDecimals(numValue);
}

/**
 * Formata input de preço enquanto usuário digita
 * Converte para formato brasileiro (vírgula como decimal)
 * 
 * @param value - Valor atual do input
 * @returns Valor formatado
 */
export function formatPriceInput(value: string): string {
  if (!value) return '';
  
  // Remove tudo que não é número ou vírgula
  let cleaned = value.replace(/[^\d,]/g, '');
  
  // Permite apenas uma vírgula
  const parts = cleaned.split(',');
  if (parts.length > 2) {
    cleaned = parts[0] + ',' + parts.slice(1).join('');
  }
  
  // Limita a 2 casas decimais após a vírgula
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + ',' + parts[1].substring(0, 2);
  }
  
  return cleaned;
}

/**
 * Converte input formatado (com vírgula) para número
 * 
 * @param value - String formatada (ex: "14,99")
 * @returns Número decimal (ex: 14.99)
 */
export function parseFormattedPrice(value: string): number {
  if (!value) return 0;
  
  const numValue = parseFloat(value.replace(',', '.'));
  return isNaN(numValue) ? 0 : formatToTwoDecimals(numValue);
}

/**
 * Valida se um preço é válido (maior que 0 e com no máximo 2 decimais)
 * 
 * @param value - Preço a ser validado
 * @returns true se válido, false caso contrário
 */
export function isValidPrice(value: number | string): boolean {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue) || numValue <= 0) {
    return false;
  }
  
  // Verifica se tem no máximo 2 casas decimais
  const decimalPart = numValue.toString().split('.')[1];
  if (decimalPart && decimalPart.length > 2) {
    return false;
  }
  
  return true;
}
