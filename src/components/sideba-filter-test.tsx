// components/filter-sidebar.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { FilterColorOption, FilterOption } from "@/types"
import { StrapiUrlBuilder } from "@/lib/url-builder"
// Importa tus componentes de Sidebar
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar" // Ajusta la ruta según tu estructura

interface FilterSidebarProps {
    category?: string,
    subcategory?: string,
    // Si decides hacerlo colapsable/controlado
    // open?: boolean;
    // onOpenChange?: (open: boolean) => void;
}

interface FilterOptions {
    tags: Array<FilterOption>,
    colors: Array<FilterColorOption>,
    materials: Array<{ name: string; count: number }>,
    sizes: Array<{ name: string; count: number }>,
    priceRange: { min: number; max: number },
}

export function FilterSidebar({ category, subcategory }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        tags: [],
        colors: [],
        materials: [],
        sizes: [],
        priceRange: { min: 0, max: 1000 }
    })
    
    const [selectedFilters, setSelectedFilters] = useState({
        tags: searchParams.get('tags')?.split(',') || [],
        colors: searchParams.get('colors')?.split(',') || [],
        materials: searchParams.get('materials')?.split(',') || [],
        // Corregido: 'sizes' en lugar de repetir 'materials'
        sizes: searchParams.get('sizes')?.split(',') || [], 
        priceRange: [
            Number.parseInt(searchParams.get('priceMin') || "0", 10),
            Number.parseInt(searchParams.get('priceMax') || "1000", 10)
        ],
        search: searchParams.get("search") || "",
    })

    // Cargar opciones de filtros disponibles
    useEffect(() => {
        async function fetchFilterOptions() {
            try {
                // Construye la URL con ambos parámetros
                const url = new URL('/api/filters', window.location.origin);
                if (category) url.searchParams.set('category', category);
                if (subcategory) url.searchParams.set('subcategory', subcategory);
                
                const response = await fetch(url.toString());
                if (response.ok) {
                    const data = await response.json();
                    setFilterOptions(data);
                }
            } catch (error) {
                console.error("Error loading filter options:", error);
            }
        }
        fetchFilterOptions();
    }, [category, subcategory]);

    // Aplicar filtros
    const applyFilters = () => {
        const urlBuilder = new StrapiUrlBuilder("/api/products", {
            category,
            subcategory,
            tags: selectedFilters.tags.length > 0 ? selectedFilters.tags : undefined,
            colors: selectedFilters.colors.length > 0 ? selectedFilters.colors : undefined,
            sizes: selectedFilters.sizes.length > 0 ? selectedFilters.sizes : undefined,
            materials: selectedFilters.materials.length > 0 ? selectedFilters.materials : undefined,
            priceMin: selectedFilters.priceRange[0] > 0 ? selectedFilters.priceRange[0] : undefined,
            priceMax:
                selectedFilters.priceRange[1] < filterOptions.priceRange.max ? selectedFilters.priceRange[1] : undefined,
            search: selectedFilters.search || undefined,
        })
        const newUrl = urlBuilder.buildFrontendUrl()
        router.push(newUrl)
    }

    // Limpiar filtros
    const clearFilters = () => {
        setSelectedFilters({
            tags: [],
            colors: [],
            materials: [],
            sizes: [],
            priceRange: [0, filterOptions.priceRange.max],
            search: "",
        })
        const urlBuilder = new StrapiUrlBuilder("/api/products", {
            category,
            subcategory,
        })
        router.push(urlBuilder.buildFrontendUrl())
    }

    // Remover filtro específico
    const removeFilter = (type: string, value: string) => {
        const newFilters = { ...selectedFilters }
        switch (type) {
            case "tag":
                newFilters.tags = newFilters.tags.filter((tag) => tag !== value)
                break
            case "material":
                newFilters.materials = newFilters.materials.filter((material) => material !== value)
                break
            case "size":
                newFilters.sizes = newFilters.sizes.filter((size) => size !== value)
                break
            case "color":
                // Corregido: filtrar `colors`, no `sizes`
                newFilters.colors = newFilters.colors.filter((color) => color !== value)
                break
        }
        setSelectedFilters(newFilters)
    }

    const hasActiveFilters =
        selectedFilters.tags.length > 0 ||
        selectedFilters.colors.length > 0 ||
        selectedFilters.materials.length > 0 ||
        selectedFilters.sizes.length > 0 ||
        selectedFilters.priceRange[0] > 0 ||
        selectedFilters.priceRange[1] < (filterOptions.priceRange?.max || 1000) ||
        Boolean(selectedFilters.search); // Asegurar booleano

    return (
        // Reemplazado Sheet con Sidebar
        // Si lo haces controlado, añade open={open} onOpenChange={onOpenChange}
        <Sidebar id="filters" side="right">
            {/* SidebarHeader reemplaza a SheetHeader */}
            <SidebarHeader className="bg-muted p-4 border-b">
                <h2 className="text-lg font-semibold">Selección de filtros</h2>
                <p className="text-sm text-muted-foreground">
                    Selecciona a tu necesidad!
                </p>
            </SidebarHeader>
            
            {/* SidebarContent reemplaza al div principal y maneja el scroll */}
            <SidebarContent className="overflow-y-auto p-2">
                
                {/* Filtros activos - Usando SidebarGroup */}
                {hasActiveFilters && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="flex items-center justify-between py-2">
                            <span>Filtros activos:</span>
                            <Button 
                                variant="link" 
                                size="sm" 
                                onClick={clearFilters}
                                className="h-auto p-0 text-primary hover:text-primary/80"
                            >
                                Limpiar todo
                            </Button>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div className="flex flex-wrap gap-2">
                                {selectedFilters.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-0.5 text-xs">
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFilter("tag", tag);
                                            }}
                                            className="rounded-full hover:bg-background/50 p-0.5 -m-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                                            aria-label={`Remover filtro ${tag}`}
                                        >
                                            <X className="h-2.5 w-2.5" />
                                        </button>
                                    </Badge>
                                ))}
                                {selectedFilters.materials.map((material) => (
                                    <Badge key={material} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-0.5 text-xs">
                                        <span>{material.toUpperCase()}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFilter("material", material);
                                            }}
                                            className="rounded-full hover:bg-background/50 p-0.5 -m-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                                            aria-label={`Remover filtro ${material}`}
                                        >
                                            <X className="h-2.5 w-2.5" />
                                        </button>
                                    </Badge>
                                ))}
                                {selectedFilters.sizes.map((size) => (
                                    <Badge key={size} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-0.5 text-xs">
                                        <span>{size}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFilter("size", size);
                                            }}
                                            className="rounded-full hover:bg-background/50 p-0.5 -m-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                                            aria-label={`Remover filtro ${size}`}
                                        >
                                            <X className="h-2.5 w-2.5" />
                                        </button>
                                    </Badge>
                                ))}
                                {selectedFilters.colors.map((color) => (
                                    <Badge key={color} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-0.5 text-xs">
                                        <span>{color}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFilter("color", color); // Corregido: tipo "color"
                                            }}
                                            className="rounded-full hover:bg-background/50 p-0.5 -m-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                                            aria-label={`Remover filtro ${color}`}
                                        >
                                            <X className="h-2.5 w-2.5" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {/* Búsqueda - Usando SidebarGroup */}
                {/* <SidebarGroup>
                    <SidebarGroupLabel className="py-2">Búsqueda</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <Input
                            placeholder="Buscar productos..."
                            value={selectedFilters.search}
                            onChange={(e) => setSelectedFilters((prev) => ({ ...prev, search: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                        />
                    </SidebarGroupContent>
                </SidebarGroup> */}

                {/* Rango de precio - Usando SidebarGroup */}
                <SidebarGroup>
                    <SidebarGroupLabel className="py-2">Precio</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="px-1 py-2">
                            <Slider
                                value={selectedFilters.priceRange}
                                onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, priceRange: value }))}
                                max={filterOptions.priceRange.max}
                                min={filterOptions.priceRange.min}
                                step={10}
                                className="w-full"
                            />
                            <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                                <span>${selectedFilters.priceRange[0]}</span>
                                <span>${selectedFilters.priceRange[1]}</span>
                            </div>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Tags - Usando SidebarGroup */}
                {filterOptions.tags.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="py-2">Etiquetas</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div className="space-y-2 py-1">
                                {filterOptions.tags.map((tag) => (
                                    <div key={tag.slug} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`tag-${tag.slug}`}
                                            checked={selectedFilters.tags.includes(tag.slug)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedFilters((prev) => ({
                                                        ...prev,
                                                        tags: [...prev.tags, tag.slug],
                                                    }))
                                                } else {
                                                    setSelectedFilters((prev) => ({
                                                        ...prev,
                                                        tags: prev.tags.filter((t) => t !== tag.slug),
                                                    }))
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`tag-${tag.slug}`} className="text-sm flex-1">
                                            {tag.name}
                                        </Label>
                                        <span className="text-xs text-muted-foreground">({tag.count})</span>
                                    </div>
                                ))}
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {/* Colores - Usando SidebarGroup */}
                {filterOptions.colors.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="py-2">Colores</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div className="space-y-2 py-1">
                                {filterOptions.colors.map((color) => (
                                    <div key={color.slug} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`color-${color.slug}`}
                                            checked={selectedFilters.colors.includes(color.slug)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedFilters((prev) => ({
                                                        ...prev,
                                                        colors: [...prev.colors, color.slug],
                                                    }))
                                                } else {
                                                    setSelectedFilters((prev) => ({
                                                        ...prev,
                                                        // Corregido: filtrar `colors`, no `sizes`
                                                        colors: prev.colors.filter((c) => c !== color.slug),
                                                    }))
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`color-${color.slug}`} className="text-sm flex-1">
                                            {color.name}
                                        </Label>
                                        <span className="text-xs text-muted-foreground">({color.count})</span>
                                    </div>
                                ))}
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {/* Materiales - Usando SidebarGroup */}
                {filterOptions.materials.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="py-2">Materiales</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div className="space-y-2 py-1">
                                {filterOptions.materials?.map((material) => (
                                    <div key={material.name} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`material-${material.name}`}
                                            checked={selectedFilters.materials.includes(material.name)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedFilters((prev) => ({
                                                        ...prev,
                                                        materials: [...prev.materials, material.name],
                                                    }))
                                                } else {
                                                    setSelectedFilters((prev) => ({
                                                        ...prev,
                                                        materials: prev.materials.filter((m) => m !== material.name),
                                                    }))
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`material-${material.name}`} className="text-sm flex-1">
                                            {material.name.toUpperCase()}
                                        </Label>
                                        <span className="text-xs text-muted-foreground">({material.count})</span>
                                    </div>
                                ))}
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {/* Tamaños - Usando SidebarGroup */}
                {filterOptions.sizes.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="py-2">Tamaños de figuras</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div className="space-y-2 py-1">
                                {filterOptions.sizes.map((size) => (
                                    <div key={size.name} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`size-${size.name}`}
                                            checked={selectedFilters.sizes.includes(size.name)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedFilters((prev) => ({
                                                        ...prev,
                                                        sizes: [...prev.sizes, size.name],
                                                    }))
                                                } else {
                                                    setSelectedFilters((prev) => ({
                                                        ...prev,
                                                        sizes: prev.sizes.filter((s) => s !== size.name),
                                                    }))
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`size-${size.name}`} className="text-sm flex-1">
                                            {size.name}
                                        </Label>
                                        <span className="text-xs text-muted-foreground">({size.count})</span>
                                    </div>
                                ))}
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>
            
            {/* SidebarFooter reemplaza a SheetFooter */}
            <SidebarFooter className="p-4 border-t bg-muted">
                <Button type="button" onClick={applyFilters} className="w-full">
                    Aplicar Filtros
                </Button>
                {/* Si quieres un botón de cancelar o reset adicional */}
                {/* <Button variant="outline" className="w-full mt-2">Cancelar</Button> */}
            </SidebarFooter>
        </Sidebar>
    )
}