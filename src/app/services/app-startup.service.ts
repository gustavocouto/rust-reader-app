import { Injectable, Injector } from "@angular/core";
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { ContextService } from './context.service';

export function loadUser(injector: Injector, contextService: ContextService) {
    return async () => {
        const router = injector.get(Router)
        const isMainRoute = !router.url.startsWith('/account')
        const isAccountRoute = router.url.startsWith('/account')
        contextService.user = await contextService.storage.getUser()

        if (!contextService.user && isMainRoute) {
            contextService.storage.clear()
            router.navigateByUrl('/account/login')
        } else if (contextService.user && isAccountRoute) {
            router.navigateByUrl('/reader')
        }

        return true
    }
}

export function loadIngredients(injector: Injector, contextService: ContextService) {
    return async () => {
        const user = await contextService.storage.getUser()
        if(!user)
            return true

        const apiService = injector.get(ApiService)
        contextService.ingredients = await contextService.storage.getIngredients()

        if (!contextService.ingredients || !contextService.ingredients.length) {
            const ingredients = await apiService.getAllIngredients().toPromise()
            contextService.ingredients = ingredients
            contextService.storage.setIngredients(ingredients)
        }

        return true
    }
}