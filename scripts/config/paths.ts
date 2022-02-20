import { resolve } from 'path'
import { PKG_NAME, BUILD_NAME } from "./constants"

// 项目根路径
export const projectRoot = resolve(__dirname, '..', '..')

// 子项目上级目录包路径
export const pkgRoot = resolve(projectRoot, PKG_NAME)

/* 构建跟目录路径 /dist */
export const buildOutput = resolve(projectRoot, BUILD_NAME)

