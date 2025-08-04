import type React from "react"
import { SearchBar } from "@/components/search-bar"
import { Suspense } from "react"
import { ProductFilters } from "@/components/header-filters"

export default function ModelsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header con barra de búsqueda */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Barra de búsqueda */}
              <div className="w-full md:w-96">
                <ProductFilters/>
                <SearchBar placeholder="Buscar modelos 3D..." />
              </div>
            </div>
          </div>
        </div>
      </Suspense>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

// http://localhost:3000/3dmodels?priceMin=30&materials=PLA%2CTPU
// http://localhost:3000/3dmodels?priceMin=30&search=naruto