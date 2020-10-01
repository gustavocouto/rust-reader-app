import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/IUser';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContextService {
    private _onLoadingChange = new Subject<boolean>()
    private _onUserChange = new Subject<IUser>()
    onLoadingChange = this._onLoadingChange.asObservable()
    onUserChange = this._onUserChange.asObservable()

    public user: IUser

    constructor(public storage: StorageService) {

    }

    setLoading(loading: boolean) {
        this._onLoadingChange.next(loading)
    }

    isPriorityAllergenic(name: string) {
        if (!this.user || !this.user.priority_allergenics)
            return false

        return this.user.priority_allergenics.some(_ => _.name == name)
    }

    async changeUser(user: IUser) {
        this.user = user
        await this.storage.setUser(user)
    }
}