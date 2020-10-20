import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IIngredient } from '../interfaces/IIngredient';
import { IUser } from '../interfaces/IUser';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private _storage: Storage) {

    }

    async getToken(): Promise<string> { return await this._storage.get('to') }

    async setToken(token: string) { await this._storage.set('to', token) }

    async getUser(): Promise<IUser> { return await this._storage.get('usr') }

    async setUser(user: IUser) { await this._storage.set('usr', user) }

    async getIngredients() { return await this._storage.get('ing') }

    async setIngredients(ingredients: IIngredient[]) { return await this._storage.set('ing', ingredients) }

    async clear() { await this._storage.clear() }
}