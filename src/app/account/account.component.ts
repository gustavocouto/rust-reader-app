import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { User } from '../models/User';

@Component({
  selector: 'app-account',
  template: '<ion-router-outlet></ion-router-outlet>'
})
export class AccountComponent implements OnInit {
  constructor(
    private _router: Router,
    private _storageService: StorageService) {
    this.initializeApp();
  }

  async initializeApp() {
    const user = await this._storageService.getUser()
    if(user) {
      this._router.navigateByUrl('/reader')
    }
  }

  ngOnInit() {

  }
}
