'use client';

import { createContext, useContext } from 'react';

/** True on a screen the user may only read: action buttons hide themselves (the server refuses them anyway). */
export const ReadOnlyContext = createContext(false);
export const useReadOnly = () => useContext(ReadOnlyContext);
