import { Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function SaveRow({ label, pending }: { label: string; pending: boolean }) {
  return (
    <div className="flex justify-end">
      <Button type="submit" disabled={pending}>
        <Save aria-hidden className="size-4" /> {label}
      </Button>
    </div>
  );
}
