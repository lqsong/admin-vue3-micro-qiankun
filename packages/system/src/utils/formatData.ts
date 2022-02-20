/** 
 * 数据格式化
 * @author LiQingSong
 */

export interface Array2dToStringReturn {
    idStr: string;
    idsStr: string;
}

export interface LevelData {
    id: number;
    pid: number;
    name: string;
}

export interface EleUiLevelData {
    value: string | number;
    label: string | number;
    children: EleUiLevelData[] | null;
}

/**
 * 二维数组 返回对应的 字符串 , 链接
 * @param val number[][] 下拉框的值 格式 [1,[1,2],[1,3]]
 * @returns Array2dToStringReturn
 * @author LiQingSong
 */
 export function Array2dToString(val: number[][]): Array2dToStringReturn {
    const obj: Array2dToStringReturn = {
        idStr: '',
        idsStr: ''
    };
    if (!val) {
        return obj;
    }

    const array: number[][] = val;
    const arrLen: number = array.length;
    const idArr: number[] = [];
    const idsArr: string[] = [];
    for (let index = 0; index < arrLen; index++) {
        const element: number[] = array[index];
        const eleLen: number = element.length;
        if (eleLen > 0) {
            idArr.push(element[eleLen - 1]);
            idsArr.push(element.join('-'));
        }        
    }

    obj['idStr'] = idArr.join(',');
    obj['idsStr'] = idsArr.join(',');

    return obj;
   
}


/**
 * 字符串 转 二维数组
 * @param val String 下拉框的值 格式 1,1-2,1-3,1-2-4
 * @returns number[][]
 * @author LiQingSong
 */
export function StringToArray2d(val: string): number[][] {
    if (!val) {
        return [];
    }

    const array: string[] = val.split(',');
    const arrLen: number = array.length;
    const arr: number[][] = [];
    for (let index = 0; index < arrLen; index++) {
        const element: string = array[index];
        const eleArr: string[] = element.split('-');
        const eArr: number[] = eleArr.map(item => {
            return Number(item);
        });
        arr.push(eArr);    
    }

    return arr;
   
}


/**
 * 格式化 element-ui 层级数据
 * @param  data      T[]     需要格式化的数据
 * @param  value     string    data 对应的 value 字段名
 * @param  label     string    data 对应的 label 字段名
 * @param  pid       string    data 对应的 pid 字段名
 * @param  pidVal    string| number    起始 pid 值
 * @returns T[] | null
 * @author LiQingSong
 */
 export function formatEleUiLevelData<T extends LevelData>(data: T[], value: string, label: string, pid: string, pidVal: string | number): EleUiLevelData[] | null {
    const len: number = data.length;
    if (len < 1) {
      return null;
    }
    const newData: EleUiLevelData [] = [];
    for (let index = 0; index < len; index++) {
      const element: T = data[index];
      if (element[pid] === pidVal) {
        newData.push({
            value: element[value],
            label: element[label],
            children: formatEleUiLevelData(data, value, label, pid, element[value])
        });
      }
    }
    
    return newData.length > 0 ? newData : null;
}