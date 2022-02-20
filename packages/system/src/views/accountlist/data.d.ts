import { PaginationConfig } from "@/components/ScreenTable/data.d";

export interface Roles {
    id: number;
    name: string;
}

export interface Account {
    id: number;
    nickname: string;
    username: string;
    password?: string;
    roles: Roles[];
}

export interface TableListQueryParams {
    page: number;
    per: number;
    keywords?: string;
    sort?: number;
    order?: number;
    refresh?: string | number;
}

export type TableListItem = Account;

export interface TableDataType {
    loading: boolean;
    list: TableListItem[];
    pagination: PaginationConfig;
}