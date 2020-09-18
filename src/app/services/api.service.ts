import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/IUser';
import { ILabel } from '../interfaces/ILabel';
import { ICompoundRead } from '../interfaces/ICompoundRead';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private _http: HttpClient) {

    }

    auth(email: string, password: string): Observable<IUser> {
        return this._http.post<IUser>(`/auth`, { email, password })
    }

    register(name: string, email: string, password: string): Observable<any> {
        return this._http.post('/user', { name, email, password })
    }

    getLabels(strict: 'all' | 'me'): Observable<ILabel[]> {
        return this._http.get<ILabel[]>(`/label?me=${strict == 'me'}`)
    }

    readImage(file: File): Observable<ICompoundRead[]> {
        const headers = new HttpHeaders()
        const formData = new FormData()
        headers.append('Content-Type', 'multipart/form-data')
        headers.append('Accept', 'application/json')
        formData.append('image', file, file.name)

        return this._http.post<ICompoundRead[]>('/read', formData, {headers})
    }

    addLabel(label: ILabel): Observable<any> {
        return this._http.post<any>('/label', label)
    }

    readImageFile(url: string, filename: string, mimeType: string): Observable<File> {
        return this._http.get(url, { responseType: 'blob' })
            .pipe(map(blob => new File([blob], filename, {type: mimeType})))
    }
}