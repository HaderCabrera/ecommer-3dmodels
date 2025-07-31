
import { FilterSidebar2 } from "@/components/filters-sidebar"

export default async function Subcategory() {

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="lg:col-span-1">
                <FilterSidebar2 category={undefined} subcategory={undefined} />
            </div>
        </div>
    )
}