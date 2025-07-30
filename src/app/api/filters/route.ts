
import { type NextRequest, NextResponse } from "next/server";
import {
    PriceComponent,
    SizeComponent,
    MaterialComponent,
    ColorComponent,
    TagComponent,
    PriceMetadata,
    SizeMetadata,
    MaterialMetadata,
    ColorMetadata,
    TagMetadata,
    FilterColorOption,
    FilterOption,
} from '@/types'


const STRAPI_URL = process.env.STRAPI_URL;



export async function GET(request: NextRequest) {
    try {

        const { searchParams } = new URL(request.url)
        const category = searchParams.get("category")
        const subcategory = searchParams.get("subcategory")


        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "Cache-Control": "force-cache"
        }

        let productFilters = ''
        if (category && subcategory) {
            productFilters += `&filters[$and][0][categories][category_slug][$eq]=${category}`;
            productFilters += `&filters[$and][1][categories][category_slug][$eq]=${subcategory}`;
        } else if (category) {
            productFilters += `&filters[categories][category_slug][$eq]=${category}`
        } else {
            productFilters = ''
        }

        //consulta
        const [tagsResponse, colorsResponse, materialResponse, sizesResponse, priceResponse] = await Promise.all([
            fetch(`${STRAPI_URL}/api/tags?populate[products][count]=true`, { headers }),
            fetch(`${STRAPI_URL}/api/colors?populate[products][count]=true`, { headers }),
            fetch(`${STRAPI_URL}/api/products?fields[0]=product_material${productFilters}`, { headers }),
            fetch(`${STRAPI_URL}/api/products?fields[0]=product_size${productFilters}`, { headers }),
            fetch(`${STRAPI_URL}/api/products?fields[0]=product_price${productFilters}`, { headers }),
        ])

        //respuesta
        const [tagsData, colorsData, materialData, sizeData, priceData] = await Promise.all([
            tagsResponse.json() as Promise<TagMetadata>,
            colorsResponse.json() as Promise<ColorMetadata>,
            materialResponse.json() as Promise<MaterialMetadata>,
            sizesResponse.json() as Promise<SizeMetadata>,
            priceResponse.json() as Promise<PriceMetadata>,
        ])

        //procesamiento
        const tags: FilterOption[] = tagsData.data?.map((tag: TagComponent) => ({
            name: tag.tag_name,
            slug: tag.tag_slug,
            count: tag.products.count,
        })).filter((tag) => tag.count > 0) || []

        const colors: FilterColorOption[] = colorsData.data?.map((color: ColorComponent) => ({
            name: color.color_name,
            slug: color.color_name,
            hex: color.color_hex,
            count: color.products.count,
        }))

        const materialCounts: { [key: string]: number } = {}
        materialData.data?.forEach((material: MaterialComponent) => {
            materialCounts[material.product_material] = (materialCounts[material.product_material] || 0) + 1
        });
        const materials = Object.entries(materialCounts).map(([name, count]) => ({
            name,
            count,
        }))

        const sizeCounts: { [key: string]: number } = {}
        sizeData.data?.forEach((size: SizeComponent) => {
            sizeCounts[size.product_size] = (sizeCounts[size.product_size] || 0) + 1
        });
        const sizes = Object.entries(sizeCounts).map(([name, count]) => ({
            name,
            count,
        }))

        const prices: number[] = (priceData.data || [])
            .map((product: PriceComponent) => product.product_price)
            .filter((price): price is number => price !== undefined && price !== null)

        const priceRange = {
            min: prices.length > 0 ? Math.min(...prices) : 0,
            max: prices.length > 0 ? Math.max(...prices) : 1000,
        }
        return NextResponse.json({
            tags,
            colors,
            materials,
            sizes,
            priceRange,
        })
    } catch (error) {
        console.log("Error en el endpoint de filtros", error)
        return NextResponse.json({ error: "Error al obtener opciones de filtros" }, { status: 500 })
    }
}

