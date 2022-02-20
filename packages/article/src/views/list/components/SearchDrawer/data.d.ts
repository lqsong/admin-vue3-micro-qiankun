
export interface SearchFormItem {
    keywords: string;
    category: number[];
    addtime: any;
    tags: string[];
}

export interface SearchValues {
    keywords: string;
    categoryid: string;
    addtimestart: string;
    addtimeend: string;
    tags: string; // 标签 , 链接的字符串
}

export interface SearchProps {
    title?: string;
    visible: boolean;
    onReset: (values: SearchValues) => void;
    onSubmit: (values: SearchValues) => void;
}
