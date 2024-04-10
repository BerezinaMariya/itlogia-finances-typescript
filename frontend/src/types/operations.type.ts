export type OperationsType = {
    error: string | null,
    redirect: string | null,
    operations: OperationResponseType[]
}

export type OperationResponseType = {
    id: number,
    type: string,
    amount: number,
    date: string,
    comment: string,
    category: string
}

export type OperationGetType = {
    error: string | null,
    redirect: string | null,
    operation: OperationResponseType | null
}

export type OperationCreateType = {
    error: string | null,
    redirect: string | null,
    id: number | null
}

export type OperationType = {
    error: string | null,
    redirect: string | null
}

export type OperationRequestDataType = {
    type:string,
    amount: number,
    date: string,
    comment: string,
    category_id: number
}