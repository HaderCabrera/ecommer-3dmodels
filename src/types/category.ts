export interface SubCategory {
    id: number,
    documentId: string,
    category_name: string,
    category_slug: string,
    category_description: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
} 

export  interface Category {
    id: number,
    documentId: string,
    category_name: string,
    category_slug: string,
    category_description: string,
    createdAt: string,
    updatedAt: string,
    publishedAt: string,
    children: Array<SubCategory>,
    parent: Array<SubCategory> | null,
}

export interface MetaData {
    pagination : {
        page : number,
        pageSize: number,
        pageCount: number,
        total: number
    }
}

export interface Categories {
    data: Array<Category>,
    meta: MetaData,
}

