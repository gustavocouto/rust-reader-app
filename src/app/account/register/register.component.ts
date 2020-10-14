import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ContextService } from 'src/app/services/context.service';
import { Validator, range, required, equals, minLength, email } from 'src/app/services/validator.service';

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

  constructor(
    private _router: Router,
    private _accountService: ApiService,
    private _contextService: ContextService
  ) {
    _contextService.onLoadingChange.subscribe(loading => this.loading = loading)
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.validator = new Validator([
      { name: 'name', ref: this.name, validations: [range(3, 100)] },
      { name: 'email', ref: this.email, validations: [email()] },
      { name: 'password', ref: this.password, validations: [minLength(5)] },
      { name: 'repeatPassword', ref: this.repeatPassword, validations: [equals(() => this.password.el.value, 'As senhas não coincidem')] }
    ])
  }

  register() {
    if(this.validator.isInvalid())
      return

    this._accountService
      .register(this.name.el.value, this.email.el.value, this.password.el.value)
      .subscribe(() => this._router.navigateByUrl('/account/login'))
  }
}
