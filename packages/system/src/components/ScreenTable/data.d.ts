export interface PaginationConfig {
  layout?: string;
  total: number;
  current: number;
  pageSize: number;
  sizes?: number[];
  sizeChange: (size: number) => void;
  onChange: (page: number) => void;
}
