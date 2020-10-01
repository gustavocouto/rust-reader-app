import { Component, OnInit } from '@angular/core';
import { ILabel } from 'src/app/interfaces/ILabel';
import { ContextService } from 'src/app/services/context.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
})
export class LabelsComponent implements OnInit {
  strict: 'all' | 'me' = 'me'
  labels: ILabel[]

  constructor(
    private _apiService: ApiService,
    private _modalController: ModalController
  ) {

  }

  ngOnInit() {
    this.filter()
  }

  filter(search?: string) {
    this._apiService
      .getLabels(this.strict, search)
      .subscribe(labels => this.labels = labels)
  }

  countRelevantIngredients(label: ILabel) {
    return label.ingredients.filter(_ => _.accuracy > environment.readThreshold.undef[0]).length
  }

  changeStrict(strict) {
    this.strict = strict
    this.filter()
  }

  async viewLabel(id: string) {
    const modal = await this._modalController.create({
      component: LabelComponent,
      componentProps: {
        id: id,
        strict: this.strict
      }
    })

    await modal.present()
  }
}