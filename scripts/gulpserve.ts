import './gulpinit'
// series 串行（顺序）执行 ，parallel并行执行
import { /* series, */ parallel } from 'gulp'
import { run } from './utils/process'
import { withTaskName } from './utils/gulp'
import { mainProjectConfig, childProjectConfig } from "./config"

// 启动主应用与子应用
export const serveMainChild = () => {

  const result = []

  const MICRO_SERVE_MAIN = process.env.MICRO_SERVE_MAIN || 'all'
  const Main = mainProjectConfig[MICRO_SERVE_MAIN] || null
  if(Main) {

    const subPro = Main['subproject']
    subPro.map(subProKey => {
      const subProItem = childProjectConfig[subProKey] || null
      if(subProItem) {
        result.push(withTaskName(`serveChild:${subProKey}`, () =>
          run(`pnpm run ${subProItem.serveRun}`)
        ))
      }
    })

    result.push(withTaskName(`serveMain:${MICRO_SERVE_MAIN}`, () =>
      run(`pnpm run ${Main.serveRun}`)
    ))

  } else {

    for(let key in childProjectConfig){
      const item = childProjectConfig[key]
      result.push(withTaskName(`serveChild:${key}`, () =>
        run(`pnpm run ${item.serveRun}`)
      ))
    }


    for(let key in mainProjectConfig){
      const item = mainProjectConfig[key]
      result.push(withTaskName(`serveMain:${key}`, () =>
        run(`pnpm run ${item.serveRun}`)
      ))
    }
  }

  return result
}

export default parallel(
  ...serveMainChild()
)
