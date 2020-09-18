import { Component, OnInit } from '@angular/core';
import { ContextService } from '../services/context.service';
import { Router, NavigationEnd } from '@angular/router';
import { IUser } from '../interfaces/IUser';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'main-root',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss']
})
export class MainComponent implements OnInit {
  user: IUser
  route: string

  constructor(
    private _router: Router,
    private _menu: MenuController,
    private _contextService: ContextService) {
    _router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.route = e.url
        _menu.close()
      }
    })

    this.initializeApp()
  }

  async initializeApp() {
    // const user = await this._storageService.getUser()
    const user: IUser = { _id: '5f41af5f1fa501e63344ec36', email: 'email@email.com', name: 'Test User', priority_allergenics: [
      { id: '5', name: 'Compound 5' }
    ]}

    if (user) {
      this.user = user
      this._contextService.storage.setUser(user)
      this._contextService.storage.setToken(user._id)
    } else {
      this._contextService.storage.clear()
      this._router.navigateByUrl('/account/login')
    }
  }

  ngOnInit() {

  }

  logout() {
    this._contextService.storage.clear()
    this._router.navigateByUrl('/account/login')
  }
}
