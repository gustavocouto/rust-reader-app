import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/IUser';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs';
import { IIngredient } from '../interfaces/IIngredient';
import { ContextService } from './context.service';
import { goAsync } from 'fuzzysort';
import { environment } from 'src/environments/environment';
import { IIngredientRead } from '../interfaces/IIngredientRead';

@Injectable({
    providedIn: 'root'
})
export class IngredientService {
    constructor(private _contextService: ContextService) {

    }

    async findIngredientsMatches(text: string): Promise<IIngredientRead[]> {
        const threshold = environment.readThreshold.unmatch[0]
        const ingredients = this._contextService.ingredients
        const ingredientsToCheck = text.replace(';', ',').replace(':', ',').split(',')
        const matchesPromises = ingredientsToCheck.map(i => {
            const search = i.trimLeft().trimRight()
            return goAsync(search, ingredients, { limit: 1, key: 'name', allowTypo: true, threshold: -Infinity })
                .then(matches => matches[0])
                .then(bestMatch => ({
                    name: search,
                    best_match: bestMatch ? bestMatch.obj : null,
                    accuracy: bestMatch ? bestMatch.score : -Infinity
                }))
        })

        return await Promise.all(matchesPromises)
    }
}