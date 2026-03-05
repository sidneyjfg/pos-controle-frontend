import React, { useState, useEffect } from 'react';
import { Input } from './Input';
import { formatPriceInput, parseFormattedPrice, formatToTwoDecimalsString } from '../../utils/currency';

interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

/**
 * Input de preço com formatação automática
 * 
 * - Formata automaticamente enquanto usuário digita
 * - Usa vírgula como separador decimal (padrão brasileiro)
 * - Limita a 2 casas decimais
 * - Retorna sempre número com 2 decimais
 * 
 * Exemplo: Usuário digita "14,99" → onChange recebe 14.99
 */
export const PriceInput: React.FC<PriceInputProps> = ({
  label,
  value,
  onChange,
  min = 0.01,
  max,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Atualiza display value quando value prop muda externamente
    if (value || value === 0) {
      setDisplayValue(value.toString().replace('.', ','));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPriceInput(e.target.value);
    setDisplayValue(formatted);

    const numValue = parseFormattedPrice(formatted);

    // Validação
    if (formatted && numValue < min) {
      setError(`Valor mínimo: R$ ${min.toFixed(2).replace('.', ',')}`);
    } else if (max && numValue > max) {
      setError(`Valor máximo: R$ ${max.toFixed(2).replace('.', ',')}`);
    } else {
      setError('');
    }

    onChange(numValue);
  };

  const handleBlur = () => {
    // Formata para 2 casas decimais ao perder foco
    if (displayValue) {
      const numValue = parseFormattedPrice(displayValue);
      const formatted = formatToTwoDecimalsString(numValue).replace('.', ',');
      setDisplayValue(formatted);
    }
  };

  return (
    <div className="relative">
      <Input
        label={label}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        placeholder="0,00"
        {...props}
      />
      <div className="absolute right-3 top-10 text-gray-500 pointer-events-none">
        R$
      </div>
    </div>
  );
};
