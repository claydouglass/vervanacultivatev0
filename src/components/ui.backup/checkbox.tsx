// @/src/components/ui/checkbox.tsx
import React from 'react';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onCheckedChange, className }) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onCheckedChange}
      className={`form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out ${className}`}
    />
  );
};

export { Checkbox };