"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { StrapiUrlBuilder } from "@/lib/url-builder"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Grid, List } from "lucide-react"

interface ProductFiltersProps {
  category?: string
  subcategory?: string
}

export function ProductFilters({ category, subcategory }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get("sortBy") || "createdAt"
  const currentOrder = searchParams.get("sortOrder") || "desc"

  const handleSortChange = (sortBy: string) => {
    const urlBuilder = StrapiUrlBuilder.fromSearchParams(
      Object.fromEntries(searchParams.entries()),
      category,
      subcategory,
    )

    // Actualizar los filtros usando métodos públicos
    urlBuilder.setSortBy(sortBy as any)
    urlBuilder.setSortOrder(sortBy === "price" ? "asc" : "desc")

    const newUrl = urlBuilder.buildFrontendUrl()
    router.push(newUrl)
  }

  const toggleSortOrder = () => {
    const urlBuilder = StrapiUrlBuilder.fromSearchParams(
      Object.fromEntries(searchParams.entries()),
      category,
      subcategory,
    )
    urlBuilder.setSortOrder(currentOrder === "asc" ? "desc" : "asc")
    const newUrl = urlBuilder.buildFrontendUrl()
    router.push(newUrl)
  }

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Ordenar por:</span>

        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Más recientes</SelectItem>
            <SelectItem value="name">Nombre</SelectItem>
            <SelectItem value="price">Precio</SelectItem>
            <SelectItem value="popularity">Popularidad</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="flex items-center gap-2 bg-transparent"
        >
          <ArrowUpDown className="h-4 w-4" />
          {currentOrder === "asc" ? "Ascendente" : "Descendente"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Grid className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
