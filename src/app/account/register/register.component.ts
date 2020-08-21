import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private _router: Router,
    private _accountService: AccountService
  ) { }

  ngOnInit() {}

  register(form: NgForm) {
    if(!form) return
    if(!form.valid) form.control.markAllAsTouched()
    if(form.value.password != form.value.confirmPassword) return

    this._accountService
      .register(form.value.name, form.value.email, form.value.password)
      .subscribe(() => this._router.navigateByUrl('/account/login'))
  }
}
