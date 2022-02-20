import { Api } from "../../data.d";

export type Api = Api;


export interface FormItem {
    name: string;
    permission: string;
    pid: number;
    pName: string;
}

export type DataItem = FormItem;


export interface FormDialogProps {
    visible: boolean;
    submitLoading?: boolean;
    values: Api;
    title?: string;
    onSubmit: (values: DataItem) => Promise<void>;
}