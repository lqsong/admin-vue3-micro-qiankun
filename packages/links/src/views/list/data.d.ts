import { PaginationConfig } from "@/components/ScreenTable/data.d";
import { CategoryItem } from "../category/data.d";

export type Category = Pick<CategoryItem, 'id' | 'name' | 'alias'>;

export interface Link {
    id: number;
    title: string;
    category: Category;
    description: string;
    href: string;
    logo: string;
}

export interface TableListQueryParams {
    page: number;
    per: number;
    categoryid: string | number;
    keywords?: string;
    sort?: number;
    order?: number;
    refresh?: string | number;
}

export type TableListItem = Pick<Link, 'id' | 'name' | 'alias'>;

export interface TableDataType {
    loading: boolean;
    columns: any;
    list: TableListItem[];
    pagination: PaginationConfig;
}
