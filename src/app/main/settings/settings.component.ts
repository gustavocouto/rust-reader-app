import { Component, OnInit, ViewChild } from '@angular/core';
import { ContextService } from 'src/app/services/context.service';
import { ApiService } from 'src/app/services/api.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  errors: any = {}
  name: string = ''
  email: string = ''
  password: string = ''
  newPassword: string = ''
  repeatNewPassword: string = ''

  constructor(
    private _apiService: ApiService,
    private _contextService: ContextService
  ) {

  }

  async ngOnInit() {
    const user = this._contextService.user
    this.name = user.name
    this.email = user.email
  }

  private hasError(errors) {
    this.errors = errors
    for(let error in this.errors)
      if(this.errors[error])
        return true;
  }

  async changeEmail() {
    const errors = {
      'name': !this.name,
      'email': !this.email
    }

    if(this.hasError(errors))
      return;

    const target = await this._contextService.storage.getUser()
    await this._apiService.changeUser(target).toPromise()
    await this._contextService.changeUser(target)
  }

  async changePassword() {
    const errors = {
      'password': !this.password,
      'newPasswordEmpty': !this.newPassword,
      'newPasswordEqual': this.newPassword == this.password,
      'repeatNewPasswordEmpty': !this.repeatNewPassword,
      'repeatNewPasswordNotEqual': this.newPassword != this.repeatNewPassword
    }

    if(this.hasError(errors))
      return;
  }
}