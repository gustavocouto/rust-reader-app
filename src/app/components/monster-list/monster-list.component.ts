import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IIngredientRead } from 'src/app/interfaces/IIngredientRead';
import { ContextService } from 'src/app/services/context.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-monster-list',
  templateUrl: './monster-list.component.html',
  styleUrls: ['./monster-list.component.scss'],
})
export class MonsterListComponent implements OnInit {
  @Input('monster') monster: string

  monsterNames: string[] = [
    'Alexis', 'Avery', 'Dallas', 'Devon', 'Drew', 'Ellis',
    'Francis', 'Frankie', 'Guile', 'Harley', 'Jordan', 'Karter',
    'Kyrie', 'Linden', 'Quincy', 'Quinn', 'Remi', 'Riley', 'Rylan', 'Taylor'
  ]

  constructor(
    private _contextService: ContextService,
    private _modalController: ModalController
  ) { }

  ngOnInit() {}

  async dismissModal(monsterName?: string)  {
    await this._modalController.dismiss({ monsterName })
  }
}