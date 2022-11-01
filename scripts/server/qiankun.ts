import { mainProjectConfig, childProjectConfig } from "../config";

export function childProjectAll(mainKey: string, props: Record<string, any> = {}, container: string = '#subapp-viewport') {
  const Apps: any = [];
  const Main = mainProjectConfig[mainKey] || null;
  if(!Main) {
    return Apps;
  }

  const subPro = Main['subproject']
  subPro.map(subProKey => {
    const subProItem = childProjectConfig[subProKey] || null
    if(subProItem) {

      /**
       * entry: 入口，服务器文件物理地址（/index.html）连接
       * activeRule: 锁定子项目基础路由(base)
       * routerBase: 设置访问的子项目基础路由(base)，与activeRule保持一致
       */
      Apps.push({
        name: subProKey,
        entry: process.env.NODE_ENV === 'production' ? `${process.env.MICRO_PUBLIC_PATH}${Main.buildChildParentName}/${subProItem.rootDir}/`: `//${subProItem.host}:${subProItem.port}${process.env.MICRO_PUBLIC_PATH}`,
        activeRule: `${process.env.MICRO_PUBLIC_PATH}${subProItem.rootDir}`,
        container: container, // 子应用挂载的div
        props: {
          routerBase: `${process.env.MICRO_PUBLIC_PATH}${subProItem.rootDir}`,
          ...props
        },
      })

    }
  })

  return Apps;
}

/**
 * 返回子项目入口
 * @param childKey 子项目名
 * @returns
 */
export function childProjectEntry(childKey: string): string {
  const childProItem = childProjectConfig[childKey] || null
  if(childProItem) {
   return process.env.NODE_ENV === 'production' ? `${process.env.MICRO_PUBLIC_PATH}${process.env.MICRO_BUILD_CHILD_NAME}/${childProItem.rootDir}/`: `//${childProItem.host}:${childProItem.port}${process.env.MICRO_PUBLIC_PATH}`
  }
  return ''

}

export * from 'qiankun'
export * from '../config'
export * from './qiankunActions'
