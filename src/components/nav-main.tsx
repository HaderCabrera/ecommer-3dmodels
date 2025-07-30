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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Category } from "@/types";
import { use } from "react";
import Link from "next/link";

interface NavMainProps {
  itemss: Promise<Category[]>;
}

export function NavMain({ itemss }: NavMainProps) {
  const items = use(itemss);
  return (
    <SidebarGroup>
      <SidebarHeader />
      <SidebarTrigger />
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.id} asChild>
            <SidebarMenuItem>
              {item.parent ? null : <SidebarMenuButton asChild tooltip={item.category_name}>
                <Link href={`/3dmodels/${item.category_slug}`}>
                  {/* <item.icon /> */}
                  <span>{item.category_slug}</span>
                </Link>
              </SidebarMenuButton>}

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
                            <Link href={`/3dmodels/${item.category_slug}/${subItem.category_slug}`}>
                              <span>{subItem.category_slug}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
