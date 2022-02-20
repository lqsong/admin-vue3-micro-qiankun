import './gulpinit'
import { resolve } from 'path'
import { mkdir } from 'fs/promises'
import { copy } from 'fs-extra'
// series 串行（顺序）执行 ，parallel并行执行
import { series, parallel } from 'gulp'
import { run } from './utils/process'
import { withTaskName } from './utils/gulp'
import { projectRoot, pkgRoot, buildOutput } from "./config/paths"
import { mainProjectConfig, childProjectConfig } from "./config"
import type { MainProjectConfigItem } from "./config"

const MICRO_BUILD_MAIN = process.env.MICRO_BUILD_MAIN || 'all'
const Main = mainProjectConfig[MICRO_BUILD_MAIN] || null

// 构建主应用与子应用
export const buildMainChild = () => {
  const result = []
  if(Main) {
    result.push(withTaskName(`buildMain:${MICRO_BUILD_MAIN}`, () =>
      run(`pnpm run ${Main.buildRun}`)
    ))

    const subPro = Main['subproject']
    subPro.map(subProKey => {
      const subProItem = childProjectConfig[subProKey] || null
      if(subProItem) {
        result.push(withTaskName(`buildChild:${subProKey}`, () =>
          run(`pnpm run ${subProItem.buildRun}`)
        ))
      }
    })
  } else {
    for(let key in mainProjectConfig){
      const item = mainProjectConfig[key]
      result.push(withTaskName(`buildMain:${key}`, () =>
        run(`pnpm run ${item.buildRun}`)
      ))
    }

    for(let key in childProjectConfig){
      const item = childProjectConfig[key]
      result.push(withTaskName(`buildChild:${key}`, () =>
        run(`pnpm run ${item.buildRun}`)
      ))
    }
  }

  return result
}

// 复制生成的子应用到指定生成的主应用中
export const copyChildFilesToMain = (mainKey: string, main: MainProjectConfigItem) => {
  const result = []
  const subPro = main['subproject']
  subPro.map(subProKey => {
    const subProItem = childProjectConfig[subProKey] || null
    if(subProItem) {
      result.push(withTaskName(`copyChild:${subProKey}:to:${mainKey}`, () =>
        copy(resolve(pkgRoot, subProItem.rootDir, subProItem.outputDir), resolve(buildOutput, main.rootDir, main.buildChildParentName, subProItem.rootDir), { recursive: true })
      ))
    }
  })

  return parallel(...result)
}

// 复制指定生成完的主应用与旗下子应用
export const copyBuildMainChild = (mainKey: string, main: MainProjectConfigItem) => {
  const seriesResult = [];

  // 复制主框架
  seriesResult.push(withTaskName(`copyMain:${mainKey}`, () =>
    copy(resolve(projectRoot, main.rootDir, main.outputDir), resolve(buildOutput, main.rootDir), { recursive: true })
  ))

  // 在复制的主框架内部创建子应用上级目录
  seriesResult.push(withTaskName(`${mainKey}:createChildOutput`, () =>
    mkdir(resolve(buildOutput, main.rootDir, main.buildChildParentName), { recursive: true })
  ))

  // 复制生成的子应用到指定主应用
  seriesResult.push(copyChildFilesToMain(mainKey, main))

  return series(...seriesResult)

}

// 复制所有生成完的主应用与子应用入口
export const copyMainChildFiles = () => {
  const result = []
  if(Main) {
    result.push(copyBuildMainChild(MICRO_BUILD_MAIN, Main))
  } else {
    for(let key in mainProjectConfig){
      const item = mainProjectConfig[key]
      result.push(copyBuildMainChild(key, item))
    }
  }
  return result
}

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(buildOutput, { recursive: true })),
  parallel(...buildMainChild()),
  parallel(...copyMainChildFiles())
)
