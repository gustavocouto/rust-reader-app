export interface IIngredient {
    id: string
    name: string
    derived_from?: IIngredient
}