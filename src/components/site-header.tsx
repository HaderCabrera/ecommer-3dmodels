"use client"

import { SidebarTriggerPersonalizado } from "@/components/ui/sidebar"


export function SiteHeader() {

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <SidebarTriggerPersonalizado/>
        <p className="text-red-500 font-bold">ACTIVIDAD: Cuando busco algo y aplico filtros se debe mantener lo que busque | de momento funciona bien que al buscar se borra todo | modificar "applyFilters" para consultar search antes de construir URL</p>
      </div>
    </header>
  )
}
