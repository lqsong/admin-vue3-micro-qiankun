
export interface PaginationConfig {
  total: number;
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
}

export interface TableListQueryParams {
  page: number;
  per: number;
  sort?: number;
}

export interface TableListItem {
  id: number;
  title: string;
  hit: number;
}

export interface ArticleHitDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}
