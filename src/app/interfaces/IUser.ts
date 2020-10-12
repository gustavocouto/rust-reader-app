import { IIngredient } from './IIngredient';

export interface IUser {
    _id: string
    name: string
    email: string
    profile_picture?: ImageData
    priority_allergenics?: IIngredient[]
}