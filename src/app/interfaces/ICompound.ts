export interface ICompound {
    id: string
    name: string
    derived_from?: ICompound
}