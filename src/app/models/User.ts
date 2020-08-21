import { Expose, Transform } from 'class-transformer'

@Expose()
export class User {
    @Expose()
    @Transform((v, o) => o._id, {toClassOnly: true})
    id: string
    
    @Expose()
    name: string
    
    @Expose()
    email: string
    
    @Expose()
    profilePicture: ImageData
}