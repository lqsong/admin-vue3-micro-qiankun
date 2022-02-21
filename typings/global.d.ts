declare global {
  interface Window {
    __QIANKUN_STARTED__: boolean;
    __POWERED_BY_QIANKUN__: string;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string;
  }
}

export {}
