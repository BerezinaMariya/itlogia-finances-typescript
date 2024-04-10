export type ValidationItemType = {
    element: HTMLInputElement | HTMLSelectElement,
    options?: {
        pattern?: RegExp,
        compareTo?: string,
        checkProperty?: boolean
    }
}