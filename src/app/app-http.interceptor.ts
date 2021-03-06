import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, from, throwError } from 'rxjs';
import { ContextService } from './services/context.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    constructor(
        private _contextService: ContextService
    ) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this._contextService.setLoading(true)
        return from(this._contextService.storage.getToken())
            .pipe(switchMap(token => {
                if (!request.url.startsWith('http')) {
                    const url = `${environment.apiUrl}${request.url}`
                    if (token)
                        request = request.clone({ url, headers: request.headers.set('Authorization', 'Bearer ' + token) })
                    else
                        request = request.clone({ url, headers: request.headers })
                }

                return next
                    .handle(request)
                    .pipe(
                        map((e: HttpEvent<any>) => {
                            if (e instanceof HttpResponse)
                                this._contextService.setLoading(false)

                            return e
                        }),
                        catchError((err) => {
                            this._contextService.setLoading(false)
                            return throwError(err)
                        })
                    )
            }))
    }
}