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
    buildChildParentName: process.env.MICRO_BUILD_CHILD_NAME,
    rootDir: 'main',
    outputDir: 'dist',
    serveRun: 'serve:main',
    buildRun: 'build:main',
    subproject: [
      'hello-world',
      'hello-china'
    ]
  },
  'main-test': {
    buildChildParentName: process.env.MICRO_BUILD_CHILD_NAME,
    rootDir: 'main-test',
    outputDir: 'dist',
    serveRun: 'serve:main-test',
    buildRun: 'build:main-test',
    subproject: [
      'hello-world'
    ]
  }
}

export const childProjectConfig: Record<string, ChildProjectConfigItem> = {
  'hello-world': {
    rootDir: process.env.MICRO_HELLO_WORLD_ROOT_DIR,
    outputDir: 'dist',
    host: process.env.MICRO_HELLO_WORLD_HOST,
    port: process.env.MICRO_HELLO_WORLD_PORT,
    serveRun: 'serve:world',
    buildRun: 'build:world'
  },
  'hello-china': {
    rootDir: process.env.MICRO_HELLO_CHINA_ROOT_DIR,
    outputDir: 'dist',
    host: process.env.MICRO_HELLO_CHINA_HOST,
    port: process.env.MICRO_HELLO_CHINA_PORT,
    serveRun: 'serve:china',
    buildRun: 'build:china'
  },
}

export default {}
