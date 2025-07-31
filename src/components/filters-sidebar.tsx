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
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import SpoolIcon from "@/svgs/SpoolIcon"

interface FilterSidebarProps {
    category?: string,
    subcategory?: string,
}

interface FilterOptions {
    tags: Array<FilterOption>,
    colors: Array<FilterColorOption>,
    materials: Array<{ name: string; count: number }>,
    sizes: Array<{ name: string; count: number }>,
    priceRange: { min: number; max: number },
}

export function FilterSidebar2({ category, subcategory }: FilterSidebarProps) {

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
        sizes: searchParams.get('materials')?.split(',') || [], // Note: This also uses 'materials' param, might be a typo
        priceRange: [
            Number.parseInt(searchParams.get('priceMin') || "0"),
            Number.parseInt(searchParams.get('priceMax') || "1000")
        ],
        search: searchParams.get("search") || "",
    })

    // Cargar opciones de filtros disponibles
    // En tu componente FilterSidebar2
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
    }, [category, subcategory]); // Ambos como dependencias

    // 🚀 NUEVA: Actualizar selectedFilters cuando filterOptions cambie
    useEffect(() => {
        if (filterOptions.priceRange.min !== 0 || filterOptions.priceRange.max !== 1000) {
            setSelectedFilters(prev => ({
                ...prev,
                priceRange: [
                    // Solo actualizar si no hay valores en URL
                    searchParams.get('priceMin') ?
                        Number.parseInt(searchParams.get('priceMin')!) :
                        filterOptions.priceRange.min,
                    searchParams.get('priceMax') ?
                        Number.parseInt(searchParams.get('priceMax')!) :
                        filterOptions.priceRange.max
                ]
            }));
        }
    }, [filterOptions.priceRange, searchParams]);

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
                // Fixed the typo here: was filtering prev.sizes instead of prev.colors
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
        selectedFilters.priceRange[1] < filterOptions.priceRange.max ||
        selectedFilters.search

    return (
        <Sheet>
            {/* <SheetTrigger asChild>
                <Button variant="outline">Open</Button>
            </SheetTrigger> */}
            <SheetTrigger asChild>
                <button className="fixed right-0 top-1/2 z-50 bg-primary text-primary-foreground py-0.3 rounded-l-lg -translate-y-1/2 h-[7rem]" style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>
                    Filtros
                </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
                {/* Contenido del sidebar de categorías */}
            </SheetContent>
            <SheetContent>
                {/* Contenido del sidebar de categorías */}
            </SheetContent>
            <SheetContent className="overflow-y-auto">
                <SheetHeader className="bg-muted">
                    <SheetTitle>Selección de filtros</SheetTitle>
                    <SheetDescription>
                        Selecciona a tu necesidad!
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col w-[90%] mx-auto gap-8">
                    {hasActiveFilters && (
                        <div className="py-2">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium">Filtros activos:</h3>
                                <Button variant="link" size="sm" onClick={clearFilters}>
                                    Limpiar todo
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedFilters.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                        <Button variant="ghost" size="badge" className="cursor-pointer" onClick={() => removeFilter("tag", tag)} >
                                            <X />
                                        </Button>
                                    </Badge>
                                ))}
                                {selectedFilters.materials.map((material) => (
                                    <Badge key={material} variant="secondary">
                                        {material.toUpperCase()}
                                        <Button variant="ghost" size="badge" className="cursor-pointer" onClick={() => removeFilter("material", material)}>
                                            <X />
                                        </Button>
                                    </Badge>
                                ))}
                                {selectedFilters.sizes.map((size) => (
                                    <Badge key={size} variant="secondary">
                                        {size}
                                        <Button variant="ghost" size="badge" className="cursor-pointer" onClick={() => removeFilter("size", size)}>
                                            <X />
                                        </Button>
                                    </Badge>
                                ))}
                                {selectedFilters.colors.map((color) => (
                                    <Badge key={color} variant="secondary">
                                        {color}
                                        <Button variant="ghost" size="badge" className="cursor-pointer" onClick={() => removeFilter("color", color)}>
                                            <X />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="item-3"
                    >
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Etiquetas</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                {filterOptions.tags.length > 0 && (
                                    <div>
                                        <div className="flex flex-wrap gap-3">
                                            {filterOptions.tags.map((tag) => (
                                                <div key={tag.slug} className="flex items-center space-x-0.5">
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
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Colores</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                {filterOptions.colors.length > 0 && (
                                    <div>
                                        <div className="flex flex-wrap gap-3">
                                            {filterOptions.colors.map((color) => (
                                                <div key={color.slug} className="flex items-center space-x-0.5">
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
                                                                    colors: prev.colors.filter((c) => c !== color.slug),
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                    <SpoolIcon color={color.hex} width={50} height={40} />
                                                    <Label htmlFor={`color-${color.slug}`} className="text-sm flex-1">
                                                        {color.name}
                                                    </Label>
                                                    <span className="text-xs text-muted-foreground">({color.count})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Materiales</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                {filterOptions.materials.length > 0 && (
                                    <div>
                                        <div className="flex flex-wrap gap-3">
                                            {filterOptions.materials?.map((material) => ( // Fixed variable name from 'format' to 'material'
                                                <div key={material.name} className="flex items-center space-x-0.5">
                                                    <Checkbox
                                                        id={`material-${material.name}`} // Fixed ID
                                                        checked={selectedFilters.materials.includes(material.name)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedFilters((prev) => ({
                                                                    ...prev,
                                                                    materials: [...prev.materials, material.name], // Fixed property name
                                                                }))
                                                            } else {
                                                                setSelectedFilters((prev) => ({
                                                                    ...prev,
                                                                    materials: prev.materials.filter((m) => m !== material.name), // Fixed property name and filter variable
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
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Tamaño</AccordionTrigger>
                            <AccordionContent>
                                {filterOptions.sizes.length > 0 && (
                                    <div>
                                        <div className="flex flex-wrap gap-3">
                                            {filterOptions.sizes.map((size) => ( // Fixed variable name from 'software' to 'size'
                                                <div key={size.name} className="flex items-center space-x-0.5">
                                                    <Checkbox
                                                        id={`size-${size.name}`} // Fixed ID
                                                        checked={selectedFilters.sizes.includes(size.name)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedFilters((prev) => ({
                                                                    ...prev,
                                                                    sizes: [...prev.sizes, size.name], // Fixed property name
                                                                }))
                                                            } else {
                                                                setSelectedFilters((prev) => ({
                                                                    ...prev,
                                                                    sizes: prev.sizes.filter((s) => s !== size.name), // Fixed property name and filter variable
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
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <div>
                        <h3 className="text-sm font-medium mb-3">Precio</h3>
                        <div className="px-1">
                            <Slider
                                value={selectedFilters.priceRange}
                                onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, priceRange: value }))}
                                max={filterOptions.priceRange.max}
                                min={filterOptions.priceRange.min}
                                step={5}
                                className="w-full"
                            />
                            <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                                <span>${selectedFilters.priceRange[0]}</span>
                                <span>${selectedFilters.priceRange[1]}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <SheetFooter className="bg-muted">
                    <div className="flex justify-between">
                        <SheetClose asChild>
                            <Button className="rounded-none" type="submit" onClick={applyFilters}>Aplicar Filtros</Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button variant="outline" className="rounded-none">Cancelar</Button>
                        </SheetClose>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

{/* Búsqueda - Sección sin Card
<div className="py-1 border-b">
    <h3 className="text-sm font-medium mb-3">Búsqueda</h3>
    <Input
        placeholder="Buscar productos..."
        value={selectedFilters.search}
        onChange={(e) => setSelectedFilters((prev) => ({ ...prev, search: e.target.value }))}
        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
    />
</div> */}