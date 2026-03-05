/**
 * Utilitários de validação e formatação para formulários
 */

/**
 * Valida se uma string contém apenas caracteres permitidos
 * Permite: letras (A-Z, a-z), números (0-9), espaços e alguns caracteres especiais básicos
 * Caracteres permitidos: . , - ( ) / & º ª
 * 
 * @param value - String a ser validada
 * @returns true se válida, false caso contrário
 */
export function isValidTextWithoutSpecialChars(value: string): boolean {
  if (!value) return true; // Vazio é válido (opcional)
  
  // Permite: letras, números, espaços e caracteres: . , - ( ) / & º ª
  const regex = /^[A-Za-z0-9\s.,\-()\/&ºª]+$/;
  return regex.test(value);
}

/**
 * Remove caracteres especiais não permitidos de uma string
 * Mantém apenas: letras, números, espaços e . , - ( ) / & º ª
 * 
 * @param value - String a ser sanitizada
 * @returns String sem caracteres especiais
 */
export function sanitizeText(value: string): string {
  if (!value) return value;
  
  // Remove qualquer caractere que não seja letra, número, espaço ou . , - ( ) / & º ª
  return value.replace(/[^A-Za-z0-9\s.,\-()\/&ºª]/g, '');
}

/**
 * Valida um campo de texto e retorna mensagem de erro se inválido
 * 
 * @param value - String a ser validada
 * @param fieldName - Nome do campo para mensagem de erro
 * @returns Mensagem de erro ou null se válido
 */
export function validateTextField(value: string, fieldName: string = 'Campo'): string | null {
  if (!value) return null;
  
  if (!isValidTextWithoutSpecialChars(value)) {
    return `${fieldName} não pode conter caracteres especiais. Permitidos: letras, números, espaços e . , - ( ) / & º ª`;
  }
  
  return null;
}

/**
 * Mensagem de erro padrão para caracteres especiais
 */
export const SPECIAL_CHARS_ERROR_MESSAGE = 
  "Campo não pode conter caracteres especiais. Permitidos: letras, números, espaços e . , - ( ) / & º ª";
