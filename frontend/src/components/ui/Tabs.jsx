import clsx from 'clsx';

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-[var(--color-border)]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={clsx(
            'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
            active === tab.key
              ? 'border-rose-600 text-rose-500'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
