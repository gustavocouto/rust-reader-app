import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ContextService } from 'src/app/services/context.service';
import { ApiService } from 'src/app/services/api.service';
import { IonInfiniteScroll, IonInput, ModalController, ToastController } from '@ionic/angular';
import { MonsterListComponent } from 'src/app/components/monster-list/monster-list.component';
import { Validator, range, email, minLength, equals, notEquals } from 'src/app/services/validator.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements AfterViewInit {
  @ViewChild('name') name: IonInput
  @ViewChild('email') email: IonInput
  @ViewChild('password') password: IonInput
  @ViewChild('newPassword') newPassword: IonInput
  @ViewChild('repeatNewPassword') repeatNewPassword: IonInput

  monsterName: string = ''
  infoValidator: Validator
  passValidator: Validator
  loading: boolean

  constructor(
    private _apiService: ApiService,
    private _contextService: ContextService,
    private _modalController: ModalController,
    private _toastController: ToastController
  ) {
    _contextService.onLoadingChange.subscribe(loading => this.loading = loading)
  }

  ngAfterViewInit() {
    this.infoValidator = new Validator([
      { name: 'name', ref: this.name, validations: [range(3, 100)] },
      { name: 'email', ref: this.email, validations: [email()] }
    ])

    this.passValidator = new Validator([
      { name: 'password', ref: this.password, validations: [minLength(5)] },
      { name: 'newPassword', ref: this.newPassword, validations: [minLength(5), notEquals(() => this.password.value as string, 'A nova senha não pode ser igual a atual')] },
      { name: 'repeatNewPassword', ref: this.repeatNewPassword, validations: [equals(() => this.newPassword.value as string, 'As senhas não coincidem')] }
    ])

    const user = this._contextService.user
    this.name.value = user.name
    this.email.value = user.email
    this.monsterName = user.monster_name
  }

  public async changeUser() {
    if (this.infoValidator.isInvalid())
      return;

    try {
      const target = await this._contextService.storage.getUser()
      target.name = this.name.value as string
      target.email = this.email.value as string
      target.monster_name = this.monsterName

      await this._apiService.changeUser(target).toPromise()
      await this._contextService.changeUser(target)
      await this._toastController.create({
        message: 'Informações alteradas',
        duration: 4000
      }).then(_ => _.present())

      this.infoValidator.reset()
    } catch (response) {
      if (response.error && response.email) {
        await this._toastController
          .create({ message: response.error.email, duration: 4000 })
          .then(_ => _.present())
      }
    }
  }

  public async changePassword() {
    if (this.passValidator.isInvalid())
      return;

    try {
      await this._apiService.changePassowrd(this.password.value as string, this.newPassword.value as string).toPromise()
      this.password.value = ''
      this.newPassword.value = ''
      this.repeatNewPassword.value = ''
      this.passValidator.reset()

      await this._toastController.create({
        message: 'Senha alterada',
        duration: 4000
      }).then(_ => _.present())
    } catch (response) {
      if (response.error && response.error.password) {
        await this._toastController
          .create({ message: response.error.password, duration: 4000 })
          .then(_ => _.present())
      }
    }
  }

  public async changeMonster() {
    const modal = await this._modalController.create({
      component: MonsterListComponent,
      componentProps: { monster: this.monsterName }
    })

    await modal.present()
    const { data } = await modal.onWillDismiss()
    if (data.monsterName)
      this.monsterName = data.monsterName
  }
}