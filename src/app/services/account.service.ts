import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    constructor(private _http: HttpClient) {

    }

    auth(email: string, password: string): Observable<User> {
        return this._http
            .post<any>(`/auth`, { email, password })
            .pipe(map(response => plainToClass(User, response, { excludeExtraneousValues: true })))
    }

    register(name: string, email: string, password: string): Observable<any> {
        return this._http
            .post('/user', { name, email, password })

    }
}