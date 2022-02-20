export interface TableListQueryParams {
  page: number;
  per: number;
}

export interface ExternalLink {
  visible: boolean;
  ruleForm: {
      url: string;
  };
  rules: any;
  insertUrl: () => Promise<void>;
}

export interface TableData {
  tableIndexMethod: (index: number) => any;
  loading: boolean;
  list: any;
  pagination: {
      total: number;
      current: number;
      pageSize: number;
      onChange: (page: number) => void;
  };
}