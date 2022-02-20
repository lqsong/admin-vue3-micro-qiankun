import { ColumnItem } from "@/components/TreeTable/data.d";
export interface tablePropType {
    loading: boolean;
    column: ColumnItem[];
}

export interface Menu {
    id: number;
    name: string;
    urlcode: string;
    type: number | string; 
    typeText?: string;   
    perms: string; 
    permsLevel: string;   
    pid: number;
    pName?: string;
}