import React, { useState, useEffect } from 'react';
import { Input } from './Input';
import { validateTextField, sanitizeText } from '../../utils/validation';

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  validateSpecialChars?: boolean;
  autoSanitize?: boolean;
  fieldName?: string;
}

/**
 * Input de texto com validação de caracteres especiais
 * 
 * Props:
 * - validateSpecialChars: Se true, valida caracteres especiais (default: true)
 * - autoSanitize: Se true, remove caracteres especiais automaticamente (default: false)
 * - fieldName: Nome do campo para mensagem de erro
 */
export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  validateSpecialChars = true,
  autoSanitize = false,
  fieldName = 'Campo',
  ...props
}) => {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (validateSpecialChars && value) {
      const errorMsg = validateTextField(value, fieldName);
      setError(errorMsg || '');
    } else {
      setError('');
    }
  }, [value, validateSpecialChars, fieldName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (autoSanitize) {
      newValue = sanitizeText(newValue);
    }

    onChange(newValue);
  };

  return (
    <Input
      label={label}
      value={value}
      onChange={handleChange}
      error={error}
      {...props}
    />
  );
};
