export interface FilterParams {
  category?: string
  subcategory?: string
  priceMin?: number
  priceMax?: number
  tags?: string[]
  colors?: string[]
  sizes?: string[]
  materials?: string[]
  sortBy?: "name" | "price" | "createdAt" | "popularity"
  sortOrder?: "asc" | "desc"
  page?: number
  pageSize?: number
  search?: string
}

export class StrapiUrlBuilder {
  private baseUrl: string
  private endpoint: string
  public filters: FilterParams

  constructor(baseUrl = "/api/products", filters: FilterParams = {}) {
    this.baseUrl = baseUrl
    this.endpoint = ""
    this.filters = filters
  }

  //   // Métodos públicos para modificar filtros
  // setSearch(search?: string): StrapiUrlBuilder {
  //   this.filters.search = search
  //   return this
  // }

  setPage(page?: number): StrapiUrlBuilder {
    this.filters.page = page
    return this
  }

  setSortBy(sortBy?: "name" | "price" | "createdAt" | "popularity"): StrapiUrlBuilder {
    this.filters.sortBy = sortBy
    return this
  }

  setSortOrder(sortOrder?: "asc" | "desc"): StrapiUrlBuilder {
    this.filters.sortOrder = sortOrder
    return this
  }

  // Construir filtros para Strapi
  private buildStrapiFilters(): Record<string, any> {
    const strapiFilters: Record<string, any> = {}

    // Filtro por categoría
    if (this.filters.category) {
      strapiFilters["category.slug"] = { $eq: this.filters.category }
    }

    // Filtro por subcategoría
    if (this.filters.subcategory) {
      strapiFilters["subcategory.slug"] = { $eq: this.filters.subcategory }
    }

    // Filtro por rango de precio
    if (this.filters.priceMin !== undefined || this.filters.priceMax !== undefined) {
      strapiFilters.price = {}
      if (this.filters.priceMin !== undefined) {
        strapiFilters.price.$gte = this.filters.priceMin
      }
      if (this.filters.priceMax !== undefined) {
        strapiFilters.price.$lte = this.filters.priceMax
      }
    }

    // Filtro por tags
    if (this.filters.tags && this.filters.tags.length > 0) {
      strapiFilters["tags.name"] = { $in: this.filters.tags }
    }

    // // Filtro por formato
    // if (this.filters.format && this.filters.format.length > 0) {
    //   strapiFilters.format = { $in: this.filters.format }
    // }

    // // Filtro por software
    // if (this.filters.software && this.filters.software.length > 0) {
    //   strapiFilters["compatibleSoftware.name"] = { $in: this.filters.software }
    // }

    // Filtro por búsqueda
    // if (this.filters.search) {
    //   strapiFilters.$or = [
    //     { name: { $containsi: this.filters.search } },
    //     { description: { $containsi: this.filters.search } },
    //     { "tags.name": { $containsi: this.filters.search } },
    //   ]
    // }

    return strapiFilters
  }

  // Construir parámetros de ordenamiento
  private buildSort(): string[] {
    const sort: string[] = []

    if (this.filters.sortBy) {
      const order = this.filters.sortOrder === "desc" ? "desc" : "asc"

      switch (this.filters.sortBy) {
        case "name":
          sort.push(`name:${order}`)
          break
        case "price":
          sort.push(`price:${order}`)
          break
        case "createdAt":
          sort.push(`createdAt:${order}`)
          break
        case "popularity":
          sort.push(`views:${order}`)
          break
        default:
          sort.push(`createdAt:desc`)
      }
    } else {
      sort.push("createdAt:desc")
    }

    return sort
  }

  // Construir parámetros de paginación
  private buildPagination(): { page: number; pageSize: number } {
    return {
      page: this.filters.page || 1,
      pageSize: this.filters.pageSize || 12,
    }
  }

  // Construir URL completa para la API
  buildApiUrl(): string {
    const url = new URL(this.baseUrl, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

    // Agregar filtros
    const filters = this.buildStrapiFilters()
    if (Object.keys(filters).length > 0) {
      url.searchParams.set("filters", JSON.stringify(filters))
    }

    // Agregar ordenamiento
    const sort = this.buildSort()
    if (sort.length > 0) {
      url.searchParams.set("sort", sort.join(","))
    }

    // Agregar paginación
    const pagination = this.buildPagination()
    url.searchParams.set("page", pagination.page.toString())
    url.searchParams.set("pageSize", pagination.pageSize.toString())

    // Agregar populate para relaciones
    url.searchParams.set("populate", "category,subcategory,tags,images,compatibleSoftware")

    return url.toString()
  }

  // Construir URL para navegación del frontend
  buildFrontendUrl(basePath = "/3dmodels"): string {
    let path = basePath

    // Agregar categoría y subcategoría al path
    if (this.filters.category) {
      path += `/${this.filters.category}`
      if (this.filters.subcategory) {
        path += `/${this.filters.subcategory}`
      }
    }

    const url = new URL(path, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

    // Agregar parámetros de consulta
    if (this.filters.priceMin !== undefined) {
      url.searchParams.set("priceMin", this.filters.priceMin.toString())
    }

    if (this.filters.priceMax !== undefined) {
      url.searchParams.set("priceMax", this.filters.priceMax.toString())
    }

    if (this.filters.tags && this.filters.tags.length > 0) {
      url.searchParams.set("tags", this.filters.tags.join(","))
    }

    if (this.filters.colors && this.filters.colors.length > 0) {
      url.searchParams.set("colors", this.filters.colors.join(","))
    }

    if (this.filters.materials && this.filters.materials.length > 0) {
      url.searchParams.set("materials", this.filters.materials.join(","))
    }

    if (this.filters.sizes && this.filters.sizes.length > 0) {
      url.searchParams.set("sizes", this.filters.sizes.join(","))
    }

    if (this.filters.sortBy) {
      url.searchParams.set("sortBy", this.filters.sortBy)
    }

    if (this.filters.sortOrder) {
      url.searchParams.set("sortOrder", this.filters.sortOrder)
    }

    if (this.filters.page && this.filters.page > 1) {
      url.searchParams.set("page", this.filters.page.toString())
    }

    if (this.filters.search) {
      url.searchParams.set("search", this.filters.search)
    }

    return url.pathname + url.search
  }

  // Método estático para crear desde searchParams de Next.js
  static fromSearchParams(
    searchParams: { [key: string]: string | string[] | undefined },
    category?: string,
    subcategory?: string,
  ): StrapiUrlBuilder {
    const filters: FilterParams = {
      category,
      subcategory,
    }

    // Convertir searchParams a FilterParams
    if (searchParams.priceMin) {
      filters.priceMin = Number.parseInt(
        Array.isArray(searchParams.priceMin) ? searchParams.priceMin[0] : searchParams.priceMin,
      )
    }

    if (searchParams.priceMax) {
      filters.priceMax = Number.parseInt(
        Array.isArray(searchParams.priceMax) ? searchParams.priceMax[0] : searchParams.priceMax,
      )
    }

    if (searchParams.tags) {
      filters.tags = Array.isArray(searchParams.tags) ? searchParams.tags : searchParams.tags.split(",")
    }

    if (searchParams.materials) {
      filters.materials = Array.isArray(searchParams.materials) ? searchParams.materials : searchParams.materials.split(",")
    }

    if (searchParams.colors) {
      filters.colors = Array.isArray(searchParams.colors) ? searchParams.colors : searchParams.colors.split(",")
    }

    if (searchParams.sizes) {
      filters.sizes = Array.isArray(searchParams.sizes) ? searchParams.sizes : searchParams.sizes.split(",")
    }


    if (searchParams.sortBy) {
      filters.sortBy = Array.isArray(searchParams.sortBy)
        ? (searchParams.sortBy[0] as any)
        : (searchParams.sortBy as any)
    }

    if (searchParams.sortOrder) {
      filters.sortOrder = Array.isArray(searchParams.sortOrder)
        ? (searchParams.sortOrder[0] as any)
        : (searchParams.sortOrder as any)
    }

    if (searchParams.page) {
      filters.page = Number.parseInt(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page)
    }

    if (searchParams.search) {
      filters.search = Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search
    }

    return new StrapiUrlBuilder("/api/products", filters)
  }
}

// Hook personalizado para usar el URL builder
export function useUrlBuilder(filters: FilterParams = {}) {
  return new StrapiUrlBuilder("/api/products", filters)
}
