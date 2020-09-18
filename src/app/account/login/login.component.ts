import { Component, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
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
    private _accountService: ApiService
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
