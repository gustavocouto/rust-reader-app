import { IUser } from './IUser'
import { IIngredient } from './IIngredient'
import { IIngredientRead } from './IIngredientRead'

export interface ILabel {
    id?: string
    name: string
    user?: IUser
    ingredients: IIngredientRead[]
    created?: Date
}