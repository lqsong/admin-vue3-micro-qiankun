import { TableListItem } from "../../data.d";



export interface FormItem {
    name: string;
    description: string;
    resources: number[][];
}

export type DataItem  = Omit<TableListItem, 'id'>;


export interface FormDialogProps {
    visible: boolean;
    submitLoading?: boolean;
    values?: TableListItem;
    title?: string;
    onSubmit: (values: DataItem) => Promise<void>;
}