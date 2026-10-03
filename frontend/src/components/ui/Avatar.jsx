import clsx from 'clsx';

export default function Avatar({ name, src, size = 'md', status }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };
  const initials = name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <div className="relative inline-flex">
      {src ? (
        <img src={src} alt={name} className={clsx('rounded-full object-cover', sizes[size])} />
      ) : (
        <div className={clsx('rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center font-medium', sizes[size])}>
          {initials}
        </div>
      )}
      {status && (
        <span className={clsx(
          'absolute bottom-0 right-0 block rounded-full ring-2 ring-[var(--color-surface)]',
          size === 'sm' ? 'h-2 w-2' : 'h-3 w-3',
          status === 'online' ? 'bg-green-400' : 'bg-gray-400'
        )} />
      )}
    </div>
  );
}
