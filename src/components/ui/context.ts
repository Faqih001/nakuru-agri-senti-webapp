import { createContext } from 'react';
import type { SidebarContext as SidebarContextType } from './types';

export const SidebarContext = createContext<SidebarContextType | null>(null);
