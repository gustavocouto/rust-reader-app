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

  getAccuracy(read: IIngredientRead) {
    const priorityAllergenic = this.isPriorityAllergenic(read)
    return priorityAllergenic ? read.accuracy + 1576 : read.accuracy
  }

  getSortedIngredients() {
    return this.ingredient_reads
      .filter(ingredient => ingredient.accuracy != environment.readThreshold.unmatch[0])
      .sort((left, right) => {
        return this.getAccuracy(left) > this.getAccuracy(right) ? -1 : 1
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

  isPriorityAllergenic(read: IIngredientRead) {
    const match = read && read.best_match;
    return this._contextService.isPriorityAllergenic(match && match.name)
      || this._contextService.isPriorityAllergenic(match && match.derived_from && match.derived_from.name) 
  }

  getAccuracyDisplay(read: IIngredientRead) {
    const accuracy = this.getAccuracy(read)
    if(accuracy < environment.readThreshold.unmatch[1])
      return `Risco 0`
    else
      return `Risco ${Math.floor((((environment.readThreshold.unmatch[1] - accuracy) * -1) / 3.1576))}`
  }

  getAccuracyDescription(read: IIngredientRead) {
    const accuracy = this.getAccuracy(read)
    if(accuracy > environment.readThreshold.match[1])
      return 'Risco extremo'
    if (accuracy > environment.readThreshold.match[0] && accuracy <= environment.readThreshold.match[1])
      return 'Risco provável'
    if (accuracy > environment.readThreshold.undef[0] && accuracy <= environment.readThreshold.undef[1])
      return 'Leitura inconcludente'
    if (accuracy > environment.readThreshold.unmatch[0] && accuracy <= environment.readThreshold.unmatch[1])
      return 'Sem riscos'
  }

  getAccuracyColor(read: IIngredientRead) {
    const accuracy = this.getAccuracy(read)
    if (accuracy > environment.readThreshold.match[0])
      return 'danger'
    if (accuracy > environment.readThreshold.undef[0] && accuracy <= environment.readThreshold.undef[1])
      return 'warning'
    if (accuracy > environment.readThreshold.unmatch[0] && accuracy <= environment.readThreshold.unmatch[1])
      return 'success'
  }
}