export class BaseApiListResponse<T> {
    constructor(){}
    code: number
    message: string
    data: T[] | null
}

export class BaseApiDetailResponse<T>{
    constructor(){}
    code: number
    message: string
    data: T | null
}