import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/IUser';
import { ILabel } from '../interfaces/ILabel';
import { IIngredientRead } from '../interfaces/IIngredientRead';
import { map } from 'rxjs/operators';
import { IIngredient } from '../interfaces/IIngredient';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private _http: HttpClient) {

    }

    auth(email: string, password: string): Observable<{token: string, user: IUser}> {
        return this._http.post<{token: string, user: IUser}>(`/auth`, { email, password })
    }

    register(name: string, email: string, password: string): Observable<any> {
        return this._http.post('/users', { name, email, password })
    }

    changeUser(user: IUser): Observable<any> {
        return this._http.put('/users', user, { responseType: 'text' })
    }

    getLabel(id: string): Observable<ILabel> {
        return this._http.get<ILabel>(`/labels/${id}`)
    }

    getLabels(strict: 'all' | 'me', search?: string): Observable<ILabel[]> {
        return this._http.get<ILabel[]>('/labels', { params: { strict, search: search || '' } })
    }

    readImage(file: File): Observable<IIngredientRead[]> {
        const headers = new HttpHeaders()
        const formData = new FormData()
        headers.append('Content-Type', 'multipart/form-data')
        headers.append('Accept', 'application/json')
        formData.append('image', file, file.name)

        return this._http.post<IIngredientRead[]>('/read', formData, {headers})
    }

    addLabel(label: ILabel): Observable<any> {
        return this._http.post<any>('/labels', label)
    }

    deleteLabel(id: string): Observable<any> {
        return this._http.delete<any>(`/labels/${id}`)
    }

    getIngredients(skip: number, limit: number, search: string = null): Observable<{ingredient: IIngredient, derived_ingredients: IIngredient[]}[]> {
        const params = { skip: String(skip), limit: String(limit), search }
        return this._http.get<{ingredient: IIngredient, derived_ingredients: IIngredient[]}[]>('/ingredients', { params })
    }

    readImageFile(url: string, filename: string, mimeType: string): Observable<File> {
        return this._http.get(url, { responseType: 'blob' })
            .pipe(map(blob => new File([blob], filename, {type: mimeType})))
    }
}