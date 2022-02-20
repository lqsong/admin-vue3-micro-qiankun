import { Account } from "../../data.d";

export type Account = Account;


export interface FormItem {
    nickname: string;
    username: string;
    password: string;
    roles: number[];
}

export type DataItem = FormItem;


export interface FormDialogProps {
    visible: boolean;
    submitLoading?: boolean;
    values?: Account;
    title?: string;
    onSubmit: (values: DataItem) => Promise<void>;
}