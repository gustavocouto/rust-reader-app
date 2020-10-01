import { Injectable, Injector } from "@angular/core";
import { Router } from '@angular/router';
import { ContextService } from './context.service';

@Injectable()
export class StartupService {
    constructor(
        private _injector: Injector,
        private _contextService: ContextService
    ) {
        
    }

    async load() {
        const router = this._injector.get(Router)
        const isMainRoute = !router.url.startsWith('/account')
        const isAccountRoute = router.url.startsWith('/account')
        this._contextService.user = await this._contextService.storage.getUser()

        if(!this._contextService.user && isMainRoute) {
            this._contextService.storage.clear()
            router.navigateByUrl('/account/login')
        } else if(this._contextService.user && isAccountRoute) {
            router.navigateByUrl('/reader')
        }

        return true
    }
}