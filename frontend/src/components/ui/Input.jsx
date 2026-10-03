import clsx from 'clsx';
import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, icon: Icon, className, ...props }, ref) {
  if (props.type === 'textarea') {
    return (
      <div className="space-y-1">
        {label && <label className="block text-sm font-medium text-[var(--color-text)]">{label}</label>}
        <textarea
          ref={ref}
          className={clsx(
            'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent resize-y min-h-[80px]',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (props.type === 'select') {
    const { options = [], type, ...selectProps } = props;
    return (
      <div className="space-y-1">
        {label && <label className="block text-sm font-medium text-[var(--color-text)]">{label}</label>}
        <select
          ref={ref}
          className={clsx(
            'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-rose-600',
            className
          )}
          {...selectProps}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-[var(--color-text)]">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-[var(--color-text-secondary)]" />
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent',
            Icon ? 'pl-9 pr-3' : 'px-3',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
