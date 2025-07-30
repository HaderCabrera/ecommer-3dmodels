

import { BookOpen, Bot, Calendar, Frame, Home, Inbox, LifeBuoy, PieChart, Plus, Search, Send, Settings, Settings2, SquareTerminal } from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"

import { Suspense } from 'react'

import { getCategories } from '@/lib/data'

export function AppSidebar() {
  const data = getCategories();

  return (
    <Sidebar side="left">
      <SidebarContent>
        <Suspense fallback={<div>Loading...</div>}>
          <NavMain itemss={data} />
        </Suspense>
      </SidebarContent>
    </Sidebar>
  )
}