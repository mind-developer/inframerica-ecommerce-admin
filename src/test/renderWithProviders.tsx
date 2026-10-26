import { render, type RenderOptions } from '@testing-library/react';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import type { ReactElement, ReactNode } from 'react';

/** Renders with the URL-state adapter, starting from `searchParams` (e.g. `?redirect=/checkout`). */
export function renderWithProviders(
  ui: ReactElement,
  { searchParams = '', ...options }: RenderOptions & { searchParams?: string } = {},
) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <NuqsTestingAdapter searchParams={searchParams}>{children}</NuqsTestingAdapter>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}
