
export interface CategoryItem {
    id: number;
    name: string;
    alias: string;
    sort: number;
}

export interface TableDataType {
    loading: boolean;
    columns: any;
    list: CategoryItem[];
}
