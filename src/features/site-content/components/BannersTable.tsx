import { GripVertical, ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { Switch } from '@/components/ui/Switch';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import type { Banner } from '@/types/content';
import { formatDate } from '@/utils/format';

interface Props {
  banners: Banner[];
  pending: boolean;
  onToggle: (banner: Banner, active: boolean) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
}

export function BannersTable({ banners, pending, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <THead>
          <tr>
            <TH className="w-16">Ordem</TH>
            <TH>Título</TH>
            <TH>Período</TH>
            <TH className="w-20">Ativo</TH>
            <TH className="w-28 text-right">Ações</TH>
          </tr>
        </THead>
        <TBody>
          {banners.map((b) => (
            <TR key={b.id}>
              <TD className="text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <GripVertical aria-hidden className="size-3.5" /> {b.position}
                </span>
              </TD>
              <TD>
                <p className="flex items-center gap-2 font-medium">
                  <ImageIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" /> {b.title}
                </p>
                <p className="max-w-md truncate text-xs text-muted-foreground">{b.subtitle}</p>
              </TD>
              <TD className="text-xs text-muted-foreground">
                {b.startDate || b.endDate ? (
                  `${b.startDate ? formatDate(b.startDate) : '—'} até ${b.endDate ? formatDate(b.endDate) : '—'}`
                ) : (
                  <Badge className="text-[11px]">Indefinido</Badge>
                )}
              </TD>
              <TD>
                <Switch
                  aria-label={`Banner ${b.title} ativo`}
                  checked={b.active}
                  disabled={pending}
                  onCheckedChange={(v) => onToggle(b, v)}
                />
              </TD>
              <TD className="text-right">
                <div className="flex justify-end gap-2">
                  <IconButton label={`Editar ${b.title}`} onClick={() => onEdit(b)}>
                    <Pencil aria-hidden className="size-4" />
                  </IconButton>
                  <IconButton label={`Excluir ${b.title}`} onClick={() => onDelete(b)}>
                    <Trash2 aria-hidden className="size-4 text-destructive" />
                  </IconButton>
                </div>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
