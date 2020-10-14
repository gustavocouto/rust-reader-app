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
  lastSearch: string
  searched: boolean = false
  loading: boolean = false

  constructor(
    private _apiService: ApiService,
    private _modalController: ModalController
  ) {
  }

  async ngOnInit() {
    await this.filter()
  }

  private async filter(search?: string) {
    this.lastSearch = search
    this.labels = await this._apiService.getLabels(this.strict, search).toPromise()
    this.searched = true
  }

  public countRelevantIngredients(label: ILabel) {
    return label.ingredients.filter(_ => _.accuracy > environment.readThreshold.undef[0]).length
  }

  public changeStrict(strict) {
    this.strict = strict
    this.filter()
  }

  public async viewLabel(id: string) {
    const modal = await this._modalController.create({
      component: LabelComponent,
      componentProps: {
        id: id,
        strict: this.strict
      }
    })

    await modal.present()
    const { data } = await modal.onWillDismiss()
    if(data && data.deleted)
      this.filter(this.lastSearch)
  }
}