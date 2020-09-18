import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
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

    async clear() { await this._storage.clear() }
}