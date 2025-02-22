export interface PaginatedResult<T> {
    items: Array<T>;
    totalItems: number;
}