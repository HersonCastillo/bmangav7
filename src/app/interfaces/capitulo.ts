export interface Capitulo {
    _id_book: any,
    _id_user: any,
    title?: string,
    chapter: number,
    storage: string,
    date_release?: Date,
    views: number,
    status?: string,
    joint?: string[],
    bcoin_value?: number,
    createdAt?: Date,
    updatedAt?: Date
}
