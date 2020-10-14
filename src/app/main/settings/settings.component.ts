import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ContextService } from 'src/app/services/context.service';
import { ApiService } from 'src/app/services/api.service';
import { IonInfiniteScroll, ModalController, ToastController } from '@ionic/angular';
import { MonsterListComponent } from 'src/app/components/monster-list/monster-list.component';
import { Validator, range, email, minLength, equals, notEquals } from 'src/app/services/validator.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements AfterViewInit {
  @ViewChild('name') name
  @ViewChild('email') email
  @ViewChild('password') password
  @ViewChild('newPassword') newPassword
  @ViewChild('repeatNewPassword') repeatNewPassword

  monsterName: string = ''
  infoValidator: Validator
  passValidator: Validator

  constructor(
    private _apiService: ApiService,
    private _contextService: ContextService,
    private _modalController: ModalController,
    private _toastController:  ToastController
  ) {

  }

  ngAfterViewInit() {
    this.infoValidator = new Validator([
      { name: 'name', ref: this.name, validations: [range(3, 100)] },
      { name: 'email', ref: this.email, validations: [email()] }
    ])

    this.passValidator = new Validator([
      { name: 'password', ref: this.password, validations: [minLength(5)] },
      { name: 'newPassword', ref: this.newPassword, validations: [minLength(5), notEquals(() => this.password.el.value, 'A nova senha não pode ser igual a atual')] },
      { name: 'repeatNewPassword', ref: this.repeatNewPassword, validations: [equals(() => this.newPassword, 'As senhas não coincidem')] }
    ])

    const user = this._contextService.user
    this.name.el.value = user.name
    this.email.el.value = user.email
    this.monsterName = user.monster_name
  }

  public async changeUser() {
    if(this.infoValidator.isInvalid())
      return;

    const target = await this._contextService.storage.getUser()
    target.name = this.name
    target.email = this.email
    target.monster_name = this.monsterName
    
    await this._apiService.changeUser(target).toPromise()
    await this._contextService.changeUser(target)
    await this._toastController.create({
      message: 'Informações alteradas',
      duration: 4000
    }).then(_ => _.present())
  }

  public async changePassword() {
    if(this.passValidator.isInvalid())
      return;

    await this._apiService.changePassowrd(this.password, this.newPassword).toPromise()
    this.password.el.value = ''
    this.newPassword.el.value = ''
    this.repeatNewPassword.el.value = ''
    await this._toastController.create({
      message: 'Senha alterada',
      duration: 4000
    }).then(_ => _.present())
  }

  public async changeMonster() {
    const modal = await this._modalController.create({
      component: MonsterListComponent,
      componentProps: { monster: this.monsterName }
    })

    await modal.present()
    const { data } = await modal.onWillDismiss()
    if(data.monsterName)
      this.monsterName = data.monsterName
  }
}