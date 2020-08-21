import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../models/User';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private _storage: Storage) {

    }

    async getToken(): Promise<string> { return await this._storage.get('to') }

    async setToken(token: string) { await this._storage.set('to', token) }

    async getUser(): Promise<User> { return plainToClass(User, await this._storage.get('usr')) }

    async setUser(user: User) { await this._storage.set('usr', classToPlain(user)) }

    async clear() { await this._storage.clear() }
}