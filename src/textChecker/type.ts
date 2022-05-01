export interface CleanElement {
    sourceElement: string // 用于拼接
    pureElement: string // 用于校对，一定是小写
    shouldCompare: boolean // 是否需要比较
}

export type WrongType = 'misspell' | 'redundant' | 'lack'

export interface CheckedElement {
    text: string // 用于拼接
    wrongType?: WrongType
}

export type CheckedResult = CheckedElement[]
