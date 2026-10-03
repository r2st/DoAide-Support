import clsx from 'clsx';

export default function Card({ children, className, hover, padding = true, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]',
        hover && 'hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
