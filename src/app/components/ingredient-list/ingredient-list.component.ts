import { Component, Input, OnInit } from '@angular/core';
import { IIngredientRead } from 'src/app/interfaces/IIngredientRead';
import { ContextService } from 'src/app/services/context.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss'],
})
export class IngredientListComponent implements OnInit {
  @Input('ingredient_reads') ingredient_reads: IIngredientRead[]

  constructor(private _contextService: ContextService) { }

  ngOnInit() {}

  getSortedIngredients() {
    return this.ingredient_reads
      .filter(ingredient => ingredient.accuracy)
      .sort((left, right) => {
        return left.accuracy > right.accuracy ? -1 : 1
      })
      .sort((left, right) => {
        if (!this._contextService.user || this._contextService.user.priority_allergenics)
          return 0

        const leftPriority = this._contextService.user.priority_allergenics.some(_ => _.id == left.best_match.id)
        const rightPriority = this._contextService.user.priority_allergenics.some(_ => _.id == right.best_match.id)
        if (leftPriority && !rightPriority) return -1
        if (!leftPriority && rightPriority) return 1
        if (leftPriority && rightPriority) return 0
        else return 0
      })
  }

  isPriorityAllergenic(name: string) {
    return this._contextService.isPriorityAllergenic(name)
  }

  getAccuracyColor(read: IIngredientRead) {
    if (read.accuracy > environment.readThreshold.match[0] && read.accuracy <= environment.readThreshold.match[1])
      return 'danger'
    if (read.accuracy > environment.readThreshold.undef[0] && read.accuracy <= environment.readThreshold.undef[1])
      return 'warning'
    if (read.accuracy > environment.readThreshold.unmatch[0] && read.accuracy <= environment.readThreshold.unmatch[1])
      return 'success'
  }
}