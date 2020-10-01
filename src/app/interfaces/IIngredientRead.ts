import { IIngredient } from './IIngredient';

export interface IIngredientRead {
    name: string
    accuracy: number
    best_match: IIngredient
}