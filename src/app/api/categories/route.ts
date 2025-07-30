import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {

        const response = await fetch(`${process.env.STRAPI_URL}/api/categories?populate=children&populate=parent`);

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // console.log(data)
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error fetching products' },
            { status: 500 }
        );
    }
}