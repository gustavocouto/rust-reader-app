import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/IUser';
import { StorageService } from './storage.service';
import { plainToClass, classToPlain } from 'class-transformer';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContextService {
    private _onLoadingChange = new Subject<boolean>()
    onLoadingChange = this._onLoadingChange.asObservable()

    constructor(public storage: StorageService) {

    }

    setLoading(loading: boolean) {
        this._onLoadingChange.next(loading)
    }
}