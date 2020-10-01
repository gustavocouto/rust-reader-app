import { Component, Input, OnInit } from '@angular/core';
import { ILabel } from 'src/app/interfaces/ILabel';
import { ContextService } from 'src/app/services/context.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class LabelComponent implements OnInit {
  @Input() id: string
  @Input() strict: string

  label: ILabel

  constructor(
    private _route: ActivatedRoute,
    private _apiService: ApiService,
    private _contextService: ContextService,
    private _modalController: ModalController
  ) {

  }

  async ngOnInit() {
    this.label = await this._apiService.getLabel(this.id).toPromise()
  }

  async dismissModal() {
    await this._modalController.dismiss()
  }

  async delete(id: string) {
    await this._apiService.deleteLabel(id).toPromise()
  }
}