import { Eye, GraduationCap, Pencil, Trash2 } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { Badge } from '@/components/ui/Badge';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { useReadOnly } from '@/components/ui/ReadOnly';
import { Switch } from '@/components/ui/Switch';
import { MODALITY_LABEL } from '@/constants/labels';
import type { Course } from '@/types/catalog';
import { formatBRL } from '@/utils/format';

export function CourseRow({
  course: c,
  sectorName,
  onEdit,
  onDelete,
  onPublish,
  publishing = false,
}: {
  course: Course;
  sectorName: string;
  onEdit: () => void;
  onDelete: () => void;
  /** Publish (true) or unpublish (false) from the list (#66). */
  onPublish: (active: boolean) => void;
  publishing?: boolean;
}) {
  const readOnly = useReadOnly();
  // Only what is filled in: a blank workload or instructor leaves no stray separator (#58).
  const meta = [
    <span key="sector">{sectorName}</span>,
    c.duration && <span key="duration">{c.duration}</span>,
    <span key="modules">{c.curriculum.length || c.modules} módulos</span>,
    <span key="price" className="font-semibold text-foreground">
      {formatBRL(c.price)}
    </span>,
    c.instructor && <span key="instructor">{c.instructor}</span>,
  ].filter(Boolean);
  return (
    <Card className="flex flex-wrap items-start justify-between gap-4 rounded-xl p-4">
      <div className="flex min-w-0 flex-1 gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS image URL of any host */}
        <img src={c.imageUrl} alt="" className="size-16 shrink-0 rounded-lg bg-muted object-cover" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <GraduationCap aria-hidden className="size-4 shrink-0 text-accent" />
            <h2 className="font-semibold">{c.title}</h2>
            <Badge>{MODALITY_LABEL[c.modality]}</Badge>
            {!c.active && <Badge tone="warning">Despublicado</Badge>}
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{c.description}</p>
          <p
            data-testid="course-meta"
            className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
          >
            {meta.map((part, i) => (
              <Fragment key={i}>
                {i > 0 && <span aria-hidden> · </span>}
                {part}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!readOnly && (
          <label className="mr-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Switch
              checked={c.active}
              disabled={publishing}
              onCheckedChange={onPublish}
              aria-label={`Publicar ${c.title}`}
            />
            Publicado
          </label>
        )}
        <Link href={`/cursos/${c.id}/preview` as Route} className={buttonStyles({ variant: 'outline', size: 'sm' })}>
          <Eye aria-hidden className="size-4" /> Preview
        </Link>
        <IconButton label={`Editar ${c.title}`} onClick={onEdit}>
          <Pencil aria-hidden className="size-4" />
        </IconButton>
        <IconButton label={`Remover ${c.title}`} onClick={onDelete}>
          <Trash2 aria-hidden className="size-4 text-destructive" />
        </IconButton>
      </div>
    </Card>
  );
}
