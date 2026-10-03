import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ icon: Icon = Inbox, title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="h-12 w-12 text-[var(--color-text-secondary)] mb-4" />
      <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">{title}</h3>
      {description && <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-md">{description}</p>}
      {action && <Button onClick={onAction}>{action}</Button>}
    </div>
  );
}
