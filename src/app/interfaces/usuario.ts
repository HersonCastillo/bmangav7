export interface Usuario {
    usernick: string,
    pass: string,
    status?: string,
    type_user: number,
    chmod_delimiter?: string,
    createdAt?: Date,
    updatedAt?: Date
}
