import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { StorageService } from './storage.service';
import { plainToClass, classToPlain } from 'class-transformer';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContextService {
    private _onChange = new Subject<boolean>()
    onChange = this._onChange.asObservable()

    constructor() {

    }

    setLoading(loading: boolean) {
        this._onChange.next(loading)
    }
}