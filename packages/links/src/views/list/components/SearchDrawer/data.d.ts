
export interface SearchFormItem {
    keywords: string;
    categoryid: number | string;
}

export interface SearchValues {
    keywords: string;
    categoryid: number | string;
}

export interface SearchProps {
    title?: string;
    visible: boolean;
    onReset: (values: SearchValues) => void;
    onSubmit: (values: SearchValues) => void;
}
