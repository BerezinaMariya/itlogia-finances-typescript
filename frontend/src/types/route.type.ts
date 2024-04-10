export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: string | null,
    load?(): void,
    unload?(): void
}