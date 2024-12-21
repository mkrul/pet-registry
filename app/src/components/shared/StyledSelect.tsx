import React from "react";

interface StyledSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
}

const StyledSelect: React.FC<StyledSelectProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
  label,
  name,
  options,
  placeholder = "Choose one"
}) => {
  return (
    <div className="relative">
      <label className="block font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={`${option}-${index}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StyledSelect;
