import { HelpCircle } from 'lucide-react';
import { useId } from 'react';
import { Tooltip } from './Tooltip';

/**
 * "Regra em definição": marks a point whose business rule the client hasn't decided yet, instead of the
 * prototype inventing one. The tooltip explains what is open.
 */
export function PendingRuleBadge({
  text = 'Regra ainda não definida com o cliente — comportamento sujeito a confirmação.',
}: {
  text?: string;
}) {
  const id = useId();
  return (
    <Tooltip id={id} content={text}>
      <span
        tabIndex={0}
        aria-describedby={id}
        className="inline-flex cursor-help items-center gap-1 rounded-full border border-warning-border bg-warning-soft px-2.5 py-0.5 text-xs text-warning"
      >
        <HelpCircle aria-hidden className="size-3" />
        Regra em definição
      </span>
    </Tooltip>
  );
}
