import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Label as Label } from '../models/Label';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

@Injectable({
    providedIn: 'root'
})
export class LabelService {
    constructor(private _http: HttpClient) {

    }

    getLabels(strict: 'all' | 'me', search: string): Observable<Label[]> {
        return this._http
            .get<any[]>(`/label?me=${strict == 'me'}`)
            .pipe(map(response => plainToClass(Label, response)))
    }
}