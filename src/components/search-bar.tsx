"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { StrapiUrlBuilder } from "@/lib/url-builder"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
    placeholder?: string
    className?: string
}

export function SearchBar({ placeholder = "Buscar productos...", className = "" }: SearchBarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")

    // Actualizar el valor cuando cambien los searchParams
    useEffect(() => {
        setSearchValue(searchParams.get("search") || "")
    }, [searchParams])

    // Extraer categoría y subcategoría del pathname
    const getRouteParams = () => {
        const pathSegments = pathname.split("/").filter(Boolean)
        if (pathSegments[0] === "3dmodels") {
            return {
                category: pathSegments[1] || undefined,
                subcategory: pathSegments[2] || undefined,
            }
        }
        return { category: undefined, subcategory: undefined }
    }

    const handleSearch = () => {
        const { category, subcategory } = getRouteParams()

        // // Crear URL builder con los filtros actuales
        // const currentFilters = Object.fromEntries(searchParams.entries())

        const currentFilters = {}

        const urlBuilder = StrapiUrlBuilder.fromSearchParams(currentFilters, category, subcategory)

        // Actualizar la búsqueda
        urlBuilder.filters.search = searchValue.trim() || undefined

        // Resetear la página a 1 cuando se hace una nueva búsqueda
        urlBuilder.filters.page = 1

        const newUrl = urlBuilder.buildFrontendUrl()
        router.push(newUrl)
    }

    const clearSearch = () => {
        setSearchValue("")
        const { category, subcategory } = getRouteParams()

        const currentFilters = Object.fromEntries(searchParams.entries())
        const urlBuilder = StrapiUrlBuilder.fromSearchParams(currentFilters, category, subcategory)

        // Remover la búsqueda
        urlBuilder.filters.search = undefined
        urlBuilder.filters.page = 1

        const newUrl = urlBuilder.buildFrontendUrl()
        router.push(newUrl)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className={`relative flex items-center gap-2 ${className}`}>
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-10"
                />
                {searchValue && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Button onClick={handleSearch} size="sm" className="shrink-0">
                Buscar
            </Button>
        </div>
    )
}
