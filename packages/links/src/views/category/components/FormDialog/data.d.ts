import { CategoryItem } from "../../data.d";



export type FormItem  = Omit<CategoryItem, 'id'>;

export type DataItem  = FormItem;


export interface FormDialogProps {
    visible: boolean;
    submitLoading?: boolean;
    values?: CategoryItem;
    title?: string;
    onSubmit: (values: DataItem) => Promise<void>;
}