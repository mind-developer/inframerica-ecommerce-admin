'use client';

import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { SCREENS, type Resource } from '@/constants/access';

/** Tab by tab: whether the profile sees it, and whether it may act there or only read. */
export function PermissionMatrix({
  value,
  held,
  onChange,
}: {
  value: string[];
  /** Only what the signed-in admin holds can be granted. */
  held: string[];
  onChange: (permissions: string[]) => void;
}) {
  const has = (p: string) => value.includes(p);
  const setRead = (r: Resource, on: boolean) =>
    onChange(on ? [...value, `${r}.read`] : value.filter((p) => p !== `${r}.read` && p !== `${r}.manage`));
  const setManage = (r: Resource, on: boolean) =>
    onChange(on ? [...new Set([...value, `${r}.read`, `${r}.manage`])] : value.filter((p) => p !== `${r}.manage`));
  return (
    <div className="rounded-xl border border-border">
      <Table>
        <THead>
          <tr>
            <TH>Aba</TH>
            <TH className="text-center">Visualizar</TH>
            <TH className="text-center">Ações</TH>
            <TH>Acesso</TH>
          </tr>
        </THead>
        <TBody>
          {SCREENS.map(({ resource, label }) => {
            const read = has(`${resource}.read`);
            const manage = has(`${resource}.manage`);
            return (
              <TR key={resource}>
                <TD className="font-medium text-foreground">{label}</TD>
                <TD className="text-center">
                  <input
                    type="checkbox"
                    aria-label={`Visualizar ${label}`}
                    checked={read}
                    disabled={!held.includes(`${resource}.read`)}
                    onChange={(e) => setRead(resource, e.target.checked)}
                    className="size-4 accent-primary"
                  />
                </TD>
                <TD className="text-center">
                  <input
                    type="checkbox"
                    aria-label={`Ações em ${label}`}
                    checked={manage}
                    disabled={!read || !held.includes(`${resource}.manage`)}
                    onChange={(e) => setManage(resource, e.target.checked)}
                    className="size-4 accent-primary"
                  />
                </TD>
                <TD className="text-sm text-muted-foreground">
                  {manage ? 'Com ações' : read ? 'Só leitura' : 'Sem acesso'}
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
