import { IIngredient } from './IIngredient';

export interface IUser {
    _id: string
    name: string
    email: string
    private_account: boolean
    profile_picture?: ImageData
    priority_allergenics?: IIngredient[]
}