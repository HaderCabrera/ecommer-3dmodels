// /[category]/[subcategory]/page.tsx
import { FilterSidebar2 } from "@/components/filters-sidebar"

export default async function Subcategory({
    params,
}: {
    params: Promise<{ category: string; subcategory: string }> // Añadido subcategory
}) {
    console.log("ENTRE A LLAMAR EL COMPONENTE DE FILTRADO")
    const { category, subcategory } = await params // Obtén ambos parámetros
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="lg:col-span-1">
                {/* Pasa ambos parámetros */}
                <FilterSidebar2 category={category} subcategory={subcategory} />
            </div>
        </div>
    )
}