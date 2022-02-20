
export interface TableListItem {
    id: number;
    name: string;
    description: string;    
    resources: string; 
    resourcesLevel: string;           
}

export interface TableDataType {
    loading: boolean;
    list: TableListItem[];
}