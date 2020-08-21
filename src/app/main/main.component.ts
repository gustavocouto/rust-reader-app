import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ContextService } from '../services/context.service';
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { User } from '../models/User';

@Component({
  selector: 'main-root',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss']
})
export class MainComponent implements OnInit {
  user: User
  route: string

  constructor(
    private _router: Router,
    private _storageService: StorageService,
    private _contextService: ContextService) {
    _router.events.subscribe(e => {
      if(e instanceof NavigationEnd)
        this.route = e.url
    })
    
    this.initializeApp()
  }

  async initializeApp() {
    // const user = await this._storageService.getUser()
    const user = new User()
    user.id = '123'
    user.email = 'email@email.com'
    user.name = 'Test User'
    if(user) { 
      this.user = user
    } else {
      this._storageService.clear()
      this._router.navigateByUrl('/account/login')
    }
  }

  ngOnInit() {

  }

  logout() {
    this._storageService.clear()
    this._router.navigateByUrl('/account/login')
  }
}
