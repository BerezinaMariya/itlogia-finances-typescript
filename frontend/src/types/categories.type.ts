export type CategoriesType = {
    error: string | null,
    redirect: string | null,
    categories: CategoryResponseType[]
}

export type CategoryResponseType = {
    id: number,
    title: string
}

export type CategoryType = {
    error: string | null,
    redirect: string | null,
}

export type CategoryGetType = {
    error: string | null,
    redirect: string | null,
    category: CategoryResponseType | null
}

export type CategoryCreateType = {
    error: string | null,
    redirect: string | null,
    id: number | null
}