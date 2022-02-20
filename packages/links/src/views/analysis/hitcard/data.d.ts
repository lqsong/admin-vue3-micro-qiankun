export interface PaginationConfig {
  total: number;
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
  onChange: (page: number, pageSize: number) => void;
  showSizeChange: (current: number, size: number) => void;
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

export interface LinksHitDataType {
  list: TableListItem[];
  columns:any;
  pagination: PaginationConfig;
}
