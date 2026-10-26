import { Eye, GraduationCap, Pencil, Trash2 } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { MODALITY_LABEL } from '@/constants/labels';
import type { Course } from '@/types/catalog';
import { formatBRL } from '@/utils/format';

export function CourseRow({
  course: c,
  sectorName,
  onEdit,
  onDelete,
}: {
  course: Course;
  sectorName: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{sectorName}</span>·<span>{c.duration}</span>·<span>{c.curriculum.length || c.modules} módulos</span>·
            <span className="font-semibold text-foreground">{formatBRL(c.price)}</span>·<span>{c.instructor}</span>
          </p>
        </div>
      </div>
      <div className="flex gap-2">
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
