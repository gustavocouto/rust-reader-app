import { Component, OnInit, ViewChild } from '@angular/core';
import { ContextService } from 'src/app/services/context.service';
import { ApiService } from 'src/app/services/api.service';
import { IIngredient } from 'src/app/interfaces/IIngredient';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  skip: number = 0
  limit: number = 20
  search: string = ''
  loading: boolean = false
  searched: boolean = false
  ingredients: { ingredient: IIngredient, derived_ingredients: IIngredient[] }[] = []

  constructor(
    private _apiService: ApiService,
    private _contextService: ContextService
  ) {
    _contextService.onLoadingChange.subscribe(loading => this.loading = loading)
  }

  isPriorityAllergenic(name: string) {
    return this._contextService.isPriorityAllergenic(name)
  }

  async searchIngredients(search: string) {
    const ingredients = await this._apiService.getIngredients(this.skip, this.limit, search).toPromise()
    this.searched = true
    return ingredients
  }

  async filter(search: string) {
    this.skip = 0
    this.limit = 20
    this.search = search
    this.infiniteScroll.disabled = false
    this.ingredients = await this.searchIngredients(search)
  }

  async incrementPage(e) {
    this.skip += 20
    const ingredients = await this.searchIngredients(this.search)
    this.ingredients = this.ingredients.concat(ingredients)
    
    e.target.complete()
    if(ingredients.length < 20)
      e.target.disabled = true
  }

  async toggleAllergenic(ingredient: IIngredient) {
    const alreadyPrioritized = this.isPriorityAllergenic(ingredient.name)
    const user = await this._contextService.storage.getUser()
    if(alreadyPrioritized) {
      user.priority_allergenics = user.priority_allergenics.filter(_ => _.id != ingredient.id)
    } else {
      user.priority_allergenics.push(ingredient)
    }

    await this._apiService.changeUser(user).toPromise()
    await this._contextService.changeUser(user)
  }

  async ngOnInit() {
    this.ingredients = await this.searchIngredients(this.search)
  }
}