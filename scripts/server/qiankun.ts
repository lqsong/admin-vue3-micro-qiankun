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

      Apps.push({
        name: subProKey,
        entry: process.env.NODE_ENV === 'production' ? `/${Main.buildChildParentName}/${subProItem.rootDir}/`: `//${subProItem.host}:${subProItem.port}/`,
        activeRule: `/${subProItem.rootDir}`,
        container: container, // 子应用挂载的div
        props: {
          routerBase: `/${subProItem.rootDir}`,
          ...props
        },
      })

    }
  })

  return Apps;
}

export * from 'qiankun'
export * from '../config'
