import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ContextService } from 'src/app/services/context.service';
import { Validator, required, email } from 'src/app/services/validator.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('email') email
  @ViewChild('password') password

  loading: boolean = false
  loadingEnv: boolean = false
  validator: Validator

  constructor(
    private _router: Router,
    private _contextService: ContextService,
    private _apiService: ApiService,
    private _toastController: ToastController
  ) {
    _contextService.onLoadingChange.subscribe(loading => this.loading = loading)
    
    _contextService.onUserRegister.subscribe(registration => {
      this.email.el.value = registration.email
      this.password.el.value = registration.password
      this.login()
    })

    _contextService.onUserLogout.subscribe(() => {
      this.email.el.value = ''
      this.password.el.value = ''
    })
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.validator = new Validator([
      { name: 'email', ref: this.email, validations: [email()] },
      { name: 'password', ref: this.password, validations: [required()] }
    ])
  }

  async loadIngredients() {
    this.loadingEnv = true
    this._contextService.ingredients = await this._contextService.storage.getIngredients()

    if (!this._contextService.ingredients || !this._contextService.ingredients.length) {
      const ingredients = await this._apiService.getAllIngredients().toPromise()
      this._contextService.ingredients = ingredients
      this._contextService.storage.setIngredients(ingredients)
    }

    this.loadingEnv = false
  }

  async login() {
    if (this.validator.isInvalid())
      return

    try {
      const response = await this._apiService.auth(this.email.el.value, this.password.el.value).toPromise()
      await this._contextService.changeUser(response.user)
      await this._contextService.storage.setToken(response.token)
      await this.loadIngredients()
      this.validator.reset()
      this._router.navigateByUrl('/')
    }
    catch(response) {
      if(response.error && response.error[0] && response.error[0].user) {
        await this._toastController
          .create({ message: 'Usuário e(ou) senha incorreto(s)', duration: 4000 })
          .then(_ => _.present())
      } else {
        throw response
      }
    }
  }
}
