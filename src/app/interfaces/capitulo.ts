export interface Capitulo {
    _id_book?: any,
    _id_user?: any,
    title?: string,
    chapter: number,
    storage: Array<string>,
    date_release?: Date,
    views: number,
    status?: string,
    joint?: string[],
    bcoin_value?: number,
    createdAt?: Date,
    updatedAt?: Date,
    _id?: string
}
