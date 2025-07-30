import { MetaData } from '@/types'

export interface PriceComponent {
    id: number,
    documentId: string,
    product_price: number,
}

export interface PriceMetadata {
    data: Array<PriceComponent>,
    meta: MetaData,
}

export interface SizeComponent {
    id: number,
    documentId: string,
    product_size: number,
}

export interface SizeMetadata {
    data: Array<SizeComponent>,
    meta: MetaData,
}

export interface MaterialComponent {
    id: number,
    documentId: string,
    product_material: string,
}

export interface MaterialMetadata {
    data: Array<MaterialComponent>,
    meta: MetaData,
}

export interface ColorComponent {
    id: number,
    documentId: string,
    color_name: string,
    color_hex: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
    products : {
        count: number,
    } 
}

export interface ColorMetadata {
    data: Array<ColorComponent>,
    meta: MetaData,
}


export interface TagComponent {
    id: number,
    documentId: string,
    tag_name: string,
    tag_slug: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
    products : {
        count: number,
    } 
}

export interface TagMetadata {
    data: Array<TagComponent>,
    meta: MetaData,
}


export interface FilterColorOption {
    name: string,
    slug: string,
    hex: string,
    count: number
}

export interface FilterOption {
    name: string,
    slug: string,
    count: number,
}