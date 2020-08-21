import { User } from './User'
import { Compound } from './Compound'

export class Label {
    name: string
    owner: User
    private: boolean
    compounds: Compound[] = []
}