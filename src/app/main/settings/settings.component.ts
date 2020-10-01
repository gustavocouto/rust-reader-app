import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ILabel } from 'src/app/interfaces/ILabel';
import { ContextService } from 'src/app/services/context.service';
import { ApiService } from 'src/app/services/api.service';
import { IIngredient } from 'src/app/interfaces/IIngredient';
import { IonInfiniteScroll } from '@ionic/angular';
import { IUser } from 'src/app/interfaces/IUser';
import { userInfo } from 'os';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  skip: number = 0
  limit: number = 20
  search: string = ''
  ingredients: { ingredient: IIngredient, derived_ingredients: IIngredient[] }[] = []

  constructor(
    private _apiService: ApiService,
    private _contextService: ContextService
  ) {
    
  }

  async changeUser(user: (user: IUser) => void) {
    const target = await this._contextService.storage.getUser()
    user(target)

    await this._apiService.changeUser(target).toPromise()
    await this._contextService.changeUser(target)
  }

  isPriorityAllergenic(name: string) {
    return this._contextService.isPriorityAllergenic(name)
  }

  filter(search: string) {
    this.skip = 0
    this.limit = 20
    this.search = search
    this.infiniteScroll.disabled = false

    this._apiService
      .getIngredients(this.skip, this.limit, search)
      .subscribe(ingredients => this.ingredients = ingredients)
  }

  incrementPage(e) {
    this.skip += 20

    this._apiService
      .getIngredients(this.skip, this.limit, this.search)
      .subscribe(ingredients => {
        this.ingredients = this.ingredients.concat(ingredients)
        e.target.complete()

        if(ingredients.length < 20)
          e.target.disabled = true
      })
  }

  toggleAllergenic(ingredient: IIngredient) {
    const present = this.isPriorityAllergenic(ingredient.name)
    this.changeUser(user => {
      if(present) {
        user.priority_allergenics = user.priority_allergenics.filter(_ => _.id != ingredient.id)
      } else {
        user.priority_allergenics.push(ingredient)
      }
    })
  }

  ngOnInit() {
    this._apiService
      .getIngredients(this.skip, this.limit, this.search)
      .subscribe(ingredients => this.ingredients = ingredients)
  }
}