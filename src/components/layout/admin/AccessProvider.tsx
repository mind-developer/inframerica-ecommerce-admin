'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { ReadOnlyContext } from '@/components/ui/ReadOnly';
import { screenOf } from '@/constants/access';

const AccessContext = createContext<{ permissions: string[] }>({ permissions: [] });
export const useAccess = () => useContext(AccessContext);

/** Shows what the server allows: the menu, and read-only mode on tabs without `manage`. */
export function AccessProvider({ permissions, children }: { permissions: string[]; children: ReactNode }) {
  const screen = screenOf(usePathname());
  const readOnly = Boolean(screen) && !permissions.includes(`${screen?.resource}.manage`);
  const value = useMemo(() => ({ permissions }), [permissions]);
  return (
    <AccessContext.Provider value={value}>
      <ReadOnlyContext.Provider value={readOnly}>{children}</ReadOnlyContext.Provider>
    </AccessContext.Provider>
  );
}
