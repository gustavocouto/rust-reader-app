import { Component, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private _router: Router,
    private _storageService: StorageService,
    private _accountService: AccountService
  ) {

  }

  ngOnInit() {}

  login(form: NgForm) {
    if(!form) return
    if(!form.valid) return form.control.markAllAsTouched()

    this._accountService
      .auth(form.value.email, form.value.password)
      .subscribe(user => {
        this._storageService.setUser(user)
        this._router.navigateByUrl('/')
      })
  }
}
