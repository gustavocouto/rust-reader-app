import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/IUser';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs';
import { IIngredient } from '../interfaces/IIngredient';

@Injectable({
    providedIn: 'root'
})
export class ContextService {
    private _onLoadingChange = new Subject<boolean>()
    private _onUserChange = new Subject<IUser>()
    private _onUserRegister = new Subject<{ email: string, password: string }>()
    private _onUserLogout = new Subject<boolean>()
    onLoadingChange = this._onLoadingChange.asObservable()
    onUserChange = this._onUserChange.asObservable()
    onUserRegister = this._onUserRegister.asObservable()
    onUserLogout = this._onUserLogout.asObservable()

    public user: IUser
    public ingredients: IIngredient[] = []

    constructor(public storage: StorageService) {

    }

    setUserRegister(email: string, password: string) {
        this._onUserRegister.next({ email, password })
    }

    setLogout() {
        this._onUserLogout.next(true)
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