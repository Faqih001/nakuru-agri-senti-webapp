import { createContext } from 'react'

export interface SidebarContext {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export type SidebarSize = "sm" | "md" | "lg"

export type SidebarVariant = "sidebar" | "floating" | "inset"

export type SidebarCollapsible = "offcanvas" | "icon" | "none"

export type SidebarSide = "left" | "right"

export const SidebarContext = createContext<SidebarContext | null>(null)
