
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import  {NavMain}  from "@/components/categories-sidebar-content"

import { Suspense } from 'react'

import { getCategories } from '@/lib/data'
import { Rotate3d } from "lucide-react";

export function AppSidebar() {
  const data = getCategories();

  return (
    <Sidebar side="left">
      <SidebarHeader className="bg-muted px-4 py-4 border-b">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Rotate3d className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Categorías</h2>
            <p className="text-xs text-muted-foreground">Organiza tu contenido</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<div>Loading...</div>}>
          <NavMain itemss={data} />
        </Suspense>
      </SidebarContent>
    </Sidebar>
  )
}