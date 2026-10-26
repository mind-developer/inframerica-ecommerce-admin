import { Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import type { Credential } from '@/types/catalog';

interface Props {
  credential: Credential;
  sectorName: (id: string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

export function CredentialCard({ credential: c, sectorName, onEdit, onDelete }: Props) {
  return (
    <li>
      <Card className="flex flex-wrap items-start justify-between gap-4 rounded-xl p-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ShieldCheck aria-hidden className="size-4 shrink-0 text-accent" />
            <h2 className="font-semibold">{c.name}</h2>
            <Badge>{c.acronym}</Badge>
            <Badge tone={c.active ? 'success' : 'neutral'}>{c.active ? 'Ativa' : 'Inativa'}</Badge>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs text-muted-foreground">
              Validade: {c.validityMonths > 0 ? `${c.validityMonths} meses` : 'indeterminada'} · Setores:
            </span>
            {c.sectorIds.map((id) => (
              <Badge key={id} className="text-[11px]">
                {sectorName(id)}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <IconButton label={`Editar ${c.name}`} onClick={onEdit}>
            <Pencil aria-hidden className="size-4" />
          </IconButton>
          <IconButton label={`Remover ${c.name}`} onClick={onDelete}>
            <Trash2 aria-hidden className="size-4 text-destructive" />
          </IconButton>
        </div>
      </Card>
    </li>
  );
}
