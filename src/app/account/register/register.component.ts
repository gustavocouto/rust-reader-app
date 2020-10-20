import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ContextService } from 'src/app/services/context.service';
import { Validator, range, required, equals, minLength, email } from 'src/app/services/validator.service';
import { MonsterListComponent } from 'src/app/components/monster-list/monster-list.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('name') name
  @ViewChild('email') email
  @ViewChild('password') password
  @ViewChild('repeatPassword') repeatPassword

  validator: Validator
  loading: boolean = false
  monsterName: string = 'Alexis'

  constructor(
    private _router: Router,
    private _accountService: ApiService,
    private _contextService: ContextService,
    private _modalController: ModalController,
    private _toastController: ToastController
  ) {
    _contextService.onLoadingChange.subscribe(loading => this.loading = loading)
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.validator = new Validator([
      { name: 'name', ref: this.name, validations: [range(3, 100)] },
      { name: 'email', ref: this.email, validations: [email()] },
      { name: 'password', ref: this.password, validations: [minLength(5)] },
      { name: 'repeatPassword', ref: this.repeatPassword, validations: [equals(() => this.password.el.value, 'As senhas não coincidem')] }
    ])
  }

  public async register() {
    if (this.validator.isInvalid())
      return

    try {
      await this._accountService.register(this.name.el.value, this.email.el.value, this.password.el.value, this.monsterName).toPromise()
      this._contextService.setUserRegister(this.email.el.value, this.password.el.value)
      this._router.navigateByUrl('/account/login')
    } catch (response) {
      if (response.error && response.error.email) {
        await this._toastController
          .create({ message: response.error.email[0], duration: 4000 })
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
