import { ColumnItem } from "@/components/TreeTable/data.d";
export interface tablePropType {
    loading: boolean;
    column: ColumnItem[];
}

export interface Api {
    id: number;
    name: string;
    permission: string;
    pid: number;
    pName?: string;
}
