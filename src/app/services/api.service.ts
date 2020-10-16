import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/IUser';
import { ILabel } from '../interfaces/ILabel';
import { IIngredientRead } from '../interfaces/IIngredientRead';
import { map } from 'rxjs/operators';
import { IIngredient } from '../interfaces/IIngredient';
import { registerLocaleData } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private _http: HttpClient) {

    }

    auth(email: string, password: string): Observable<{token: string, user: IUser}> {
        return this._http.post<{token: string, user: IUser}>(`/auth`, { email, password })
    }

    changePassowrd(oldPassword: string, newPassword: string): Observable<any> {
        return this._http.put('/auth', { old_password: oldPassword, new_password: newPassword })
    }

    register(name: string, email: string, password: string): Observable<any> {
        return this._http.post('/users', { name, email, password })
    }

    changeUser(user: IUser): Observable<any> {
        return this._http.put('/users', user, { responseType: 'text' })
    }

    getLabel(id: string): Observable<ILabel> {
        return this._http.get<ILabel>(`/labels/${id}`)
            .pipe(map(label => {
                const nullVal = environment.readThreshold.unmatch[0]
                for(let read of label.ingredients)
                    read.accuracy = read.accuracy === null ? nullVal : read.accuracy
                
                return label
            }))
    }

    getLabels(strict: 'all' | 'me', search?: string): Observable<ILabel[]> {
        return this._http.get<ILabel[]>('/labels', { params: { strict, search: search || '' } })
    }

    readImageAsText(file: File): Observable<string> {
        const headers = new HttpHeaders()
        const formData = new FormData()
        headers.append('Content-Type', 'multipart/form-data')
        headers.append('Accept', 'application/json')
        formData.append('image', file, file.name)

        return this._http.post<string>('/read-text', formData, {headers})
    }

    readImageAsIngredients(file: File): Observable<IIngredientRead[]> {
        const headers = new HttpHeaders()
        const formData = new FormData()
        headers.append('Content-Type', 'multipart/form-data')
        headers.append('Accept', 'application/json')
        formData.append('image', file, file.name)

        return this._http.post<IIngredientRead[]>('/read-ingredients', formData, {headers})
    }

    addLabel(label: ILabel): Observable<any> {
        return this._http.post<any>('/labels', label)
    }

    deleteLabel(id: string): Observable<any> {
        return this._http.delete<any>(`/labels/${id}`)
    }

    getAllIngredients(): Observable<IIngredient[]> {
        return this._http.get('/assets/ingredients.txt', { responseType: 'text' })
            .pipe(map<string, IIngredient[]>(text => {
                debugger
                const lines = text.split('\n').slice(1)
                const ingredientsLines = lines.map(_ => _.split('|'))
                return ingredientsLines.map(line => {
                    const derivedFromId = line[2]
                    const derivedFromName = line[3]
                    const derivedFrom = derivedFromId ? { id: derivedFromId, name: derivedFromName } as IIngredient : null
                    return { id: line[0], name: line[1], derived_from: derivedFrom } as IIngredient
                }, []) as IIngredient[]
            }))
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