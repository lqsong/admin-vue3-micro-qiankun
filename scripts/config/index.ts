/**
 * 配置
 */

// 主框架配置
export interface MainProjectConfigItem {
  // 主框架项目目录名，也作为生产主应用目录名
  rootDir: string;
  // 主框架项目内部构建目录名
  outputDir: string;
  // 主框架项目的子项目上级目录名
  buildChildParentName: string;
  // 开发命令，需要在框架根目录/package.json中scripts内配置好
  serveRun: string;
  // 构建命令，需要在框架根目录/package.json中scripts内配置好
  buildRun: string;
  // 子项目名称(childProjectConfig的key)数组
  subproject: string[];
}

// 子项目配置
export interface ChildProjectConfigItem {
  // 子项目目录名，也作为生产子应用目录名
  rootDir: string;
  // 子项目内部构建目录名
  outputDir: string;
  // 开发 localhost 或者 ip
  host: string;
  // 开发端口
  port: number;
  // 开发命令，需要在框架根目录/package.json中scripts内配置好
  serveRun: string;
  // 构建命令，需要在框架根目录/package.json中scripts内配置好
  buildRun: string;
}

export const mainProjectConfig: Record<string, MainProjectConfigItem> = {
  'main': {
    buildChildParentName: process.env.MICRO_BUILD_CHILD_NAME || '',
    rootDir: 'main',
    outputDir: 'dist',
    serveRun: 'serve:main',
    buildRun: 'build:main',
    subproject: [
      'system',
      'article',
      'links',
    ]
  },
  'main-antd': {
    buildChildParentName: process.env.MICRO_BUILD_CHILD_NAME || '',
    rootDir: 'main-antd',
    outputDir: 'dist',
    serveRun: 'serve:main-antd',
    buildRun: 'build:main-antd',
    subproject: [
      'system',
      'article',
      'links',
    ]
  }
}

export const childProjectConfig: Record<string, ChildProjectConfigItem> = {
  'system': {
    rootDir: process.env.MICRO_SYSTEM_ROOT_DIR || '',
    outputDir: 'dist',
    host: process.env.MICRO_SYSTEM_HOST || '',
    port: Number(process.env.MICRO_SYSTEM_PORT || 0),
    serveRun: 'serve:system',
    buildRun: 'build:system'
  },
  'article': {
    rootDir: process.env.MICRO_ARTICLE_ROOT_DIR || '',
    outputDir: 'dist',
    host: process.env.MICRO_ARTICLE_HOST || '',
    port: Number(process.env.MICRO_ARTICLE_PORT || 0),
    serveRun: 'serve:article',
    buildRun: 'build:article'
  },
  'links': {
    rootDir: process.env.MICRO_LINKS_ROOT_DIR || '',
    outputDir: 'dist',
    host: process.env.MICRO_LINKS_HOST || '',
    port: Number(process.env.MICRO_LINKS_PORT || 0),
    serveRun: 'serve:links',
    buildRun: 'build:links'
  },
}

export default {}
