export interface Libro {
    book_name: string,
    image?: string,
    description?: string,
    genders_type: string,
    status: string,
    views?: number,
    _id_user: any,
    createdAt?: Date,
    updatedAt?: Date
}
