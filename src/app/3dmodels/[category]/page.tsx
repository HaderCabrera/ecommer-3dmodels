import { FilterSidebar2 } from "@/components/filters-sidebar"

export default async function Subcategory({
    params,
}: {
    params: Promise<{ category: string }>
}) {
    const { category } = await params
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="lg:col-span-1">
                <FilterSidebar2 category={category} subcategory={undefined} />
                {/* <FilterSidebar2/> */}
            </div>
        </div>
    )
}