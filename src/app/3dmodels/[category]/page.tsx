import { FilterSidebar2 } from "@/components/filter-sidebar-2"

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