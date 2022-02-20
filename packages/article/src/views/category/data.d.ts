import { ColumnItem } from "@/components/TreeTable/data.d";
export interface tablePropType {
    loading: boolean;
    column: ColumnItem[];
}

export interface CategoryItem {
    id: number;
    name: string;
    alias: string;
    title: string;
    keywords: string;
    description: string;
    pid: number;
}


export interface DataItemParam {
    name: string;
    alias: string;
    title: string;
    keywords: string;
    description: string;
    pid: number;
}
