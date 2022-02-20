import { Link } from "../../data.d";

export type Link = Link;


export interface FormItem {
    categoryId: number | string;
    title: string;
    href: string;
    description: string;
    logo: string[];
}

export interface DataItem {
    categoryId: number | string;
    title: string;
    href: string;
    description: string;
    logo: string;
}


export interface FormDialogProps {
    visible: boolean;
    submitLoading?: boolean;
    values?: Link;
    title?: string;
    onSubmit: (values: DataItem) => Promise<void>;
}