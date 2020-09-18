import { IUser } from './IUser'
import { ICompound } from './ICompound'
import { ICompoundRead } from './ICompoundRead'

export interface ILabel {
    name: string
    user?: IUser
    compounds: ICompoundRead[]
}