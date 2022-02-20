import { TableListItem } from "../list/data.d";

export type Article = Pick<TableListItem, 'id' | 'title' | 'addtime'>;

export interface FormItem {
    title: string;
    category: number[];
    keywords: string;
    description: string;
    addtime: string;
    tag: string[];
    thumb: string[];
    content: string;
}

export interface DataItem {
    title: string;
    categoryId: number | string;
    categoryIds: string;
    keywords: string;
    description: string;
    addtime: string;
    tag: string;
    thumb: string;
    content: string;
    interestIds: string;
}

export interface ArticleRec {
    list: Article[];
    drawerVisible: boolean;
    selectArticle: (row: Article)=> void;
    deleteArticleRow: (index: number) => void;
}