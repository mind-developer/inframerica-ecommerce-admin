'use client';

import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import type { CourseStatus } from '../utils/courseFilters';

/** Search box plus the published/unpublished filter (#66). Filters, not actions: they stay on read-only screens. */
export function CourseFilters({
  q,
  status,
  onSearch,
  onStatus,
}: {
  q: string;
  status: CourseStatus | null;
  onSearch: (value: string) => void;
  onStatus: (value: CourseStatus) => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-3">
      <SearchInput
        className="min-w-[220px] flex-1"
        value={q}
        onChange={onSearch}
        placeholder="Buscar por título, categoria ou instrutor"
      />
      <StatusButton label="Publicados" pressed={status === 'published'} onToggle={() => onStatus('published')} />
      <StatusButton label="Despublicados" pressed={status === 'draft'} onToggle={() => onStatus('draft')} />
    </div>
  );
}

function StatusButton({ label, pressed, onToggle }: { label: string; pressed: boolean; onToggle: () => void }) {
  return (
    <Button variant={pressed ? 'primary' : 'outline'} aria-pressed={pressed} onClick={onToggle}>
      {label}
    </Button>
  );
}
