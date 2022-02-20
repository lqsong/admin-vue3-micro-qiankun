/**
 * 根据注入的childProjectEntry函数获取对应子项目入口  composables
 * @author LiQingSong
 */
import { inject } from 'vue'

export default function useInjectMicroChildEntry(name: string): string {
    const childProjectEntry: Function = inject<Function>('childProjectEntry', function(name: string) {
        return name
    })
    return childProjectEntry(name)
}
