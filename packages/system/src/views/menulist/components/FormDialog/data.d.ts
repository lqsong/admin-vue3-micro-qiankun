import { Menu } from "../../data.d";

export type Menu = Menu;


export interface FormItem {
    name: string;
    urlcode: string;
    type: number | string;    
    perms: number[][];  
    pid: number;
    pName: string;
}

export type DataItem = Omit<Menu, 'id'>;


export interface FormDialogProps {
    visible: boolean;
    submitLoading?: boolean;
    values: Menu;
    title?: string;
    onSubmit: (values: DataItem) => Promise<void>;
}