// components/Dropdown.tsx
import React, { type ChangeEvent } from 'react';

interface DropdownProps {
  options: { value: string; label: string }[];
  onChange: (selectedValue: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onChange }) => {
  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select onChange={handleDropdownChange}>
      <option value="">
        Pick One
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;