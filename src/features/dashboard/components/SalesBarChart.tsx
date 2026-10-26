'use client';

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { LOCALE } from '@/constants/locale';
import { formatBRL } from '@/utils/format';
import type { ChartDatum } from '../utils/dashboardMetrics';

const config = { value: { label: 'Receita', color: 'var(--chart-1)' } } satisfies ChartConfig;
const PALETTE = ['var(--chart-1)', 'var(--navy-light)', 'var(--graphite)', 'var(--chart-4)', 'var(--chart-3)'];
const COMPACT = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'BRL', notation: 'compact' });
const compactBRL = (v: number) => COMPACT.format(v);
const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}…` : s);

interface Props {
  title: string;
  description: string;
  data: ChartDatum[];
  /** Horizontal bars (long category names). */
  horizontal?: boolean;
  className?: string;
}

/** Revenue bar chart on shadcn's ChartContainer; the token palette keeps it in the brand colours. */
export function SalesBarChart({ title, description, data, horizontal = false, className }: Props) {
  const rows = data.map((d) => ({ ...d, label: truncate(d.name, horizontal ? 22 : 24) }));
  const tick = { fontSize: 11, fill: 'var(--muted-foreground)' };
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma venda registrada.</p>
        ) : (
          <ChartContainer config={config} className="h-[340px] w-full">
            <BarChart
              data={rows}
              layout={horizontal ? 'vertical' : 'horizontal'}
              margin={{ top: 16, right: 16, left: horizontal ? 8 : 32, bottom: 8 }}
              barCategoryGap="28%"
              accessibilityLayer
            >
              <CartesianGrid strokeDasharray="3 6" vertical={horizontal} horizontal={!horizontal} />
              {horizontal ? (
                <>
                  <XAxis type="number" tick={tick} axisLine={false} tickLine={false} tickFormatter={compactBRL} />
                  <YAxis type="category" dataKey="label" tick={tick} width={130} axisLine={false} tickLine={false} />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey="label"
                    tick={tick}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={compactBRL} />
                </>
              )}
              <ChartTooltip
                cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                content={<ChartTooltipContent formatter={(v) => formatBRL(Number(v))} />}
              />
              <Bar dataKey="value" fill="var(--color-value)" radius={horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}>
                {horizontal && rows.map((d, i) => <Cell key={d.name} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
