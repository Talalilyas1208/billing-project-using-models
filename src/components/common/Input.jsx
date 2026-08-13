import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full text-sm rounded-lg border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            Icon ? 'pl-9' : 'pl-3'
          } pr-3 py-2 ${
            error
              ? 'border-red-400 bg-red-50/50 text-red-900 placeholder-red-300'
              : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 hover:border-slate-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium pl-0.5">{error}</p>}
    </div>
  );
};

export default Input;
