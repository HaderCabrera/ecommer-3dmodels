"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { Category } from "@/types";
import { use } from "react";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar"


interface NavMainProps {
  itemss: Promise<Category[]>;
}

export function NavMain({ itemss }: NavMainProps) {
  const items = use(itemss);
  const { isMobile, setOpen, setOpenMobile } = useSidebar();

  // Función para manejar el cierre automático
  const handleCloseSidebar = () => {
    if (isMobile) {
      setOpenMobile(false); // Cierra en versión móvil
    } else {
      setOpen(true); // Cierra en versión desktop
    }
  };

  return (
    <SidebarGroup>
      <SidebarHeader />
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.id} asChild>
            <SidebarMenuItem>
              <div className="flex flex-col w-[90%] mx-auto pb-[0.6rem] gap-4">
                {item.parent ? null :
                  <SidebarMenuButton
                    asChild
                    tooltip={item.category_name}
                    className="rounded-none border-blue border-b-3"
                  >
                    <Link href={`/3dmodels/${item.category_slug}`} onClick={handleCloseSidebar}>
                      {/* <item.icon /> */}
                      <span>{item.category_slug}</span>
                    </Link>
                  </SidebarMenuButton>
                }

                {item.children?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.category_name}>
                            <SidebarMenuSubButton asChild>
                              <Link href={`/3dmodels/${item.category_slug}/${subItem.category_slug}`} onClick={handleCloseSidebar}>
                                <span>{subItem.category_slug}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </div>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup >
  )
}
