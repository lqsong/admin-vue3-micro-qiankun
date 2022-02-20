import { PaginationConfig } from "@/components/ScreenTable/data.d";
import { CategoryItem } from "../category/data.d";

export type Category = Pick<CategoryItem, 'id' | 'name' | 'alias'>;

export interface TableListQueryParams {
    page: number;
    per: number;
    keywords?: string;
    categoryid?: string;
    addtimestart?: string;
    addtimeend?: string;
    tags?: string;
    sort?: number;
    order?: number;
    refresh?: string | number;
}

export interface TableListItem {
    id: number;
    title: string;
    category: Category;
    addtime: string;
    tag: string;
    hit: number;
    tags:? string[];
}

export interface TableDataType {
    loading: boolean;
    list: TableListItem[];
    pagination: PaginationConfig;
}