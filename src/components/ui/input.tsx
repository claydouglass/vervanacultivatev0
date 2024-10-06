import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

export const Input: React.FC<InputProps> = ({ id, defaultValue, type = "text", ...props }) => (
  <input
    id={id}
    defaultValue={defaultValue}
    type={type}
    className="w-full p-2 border rounded"
    {...props}
  />
);