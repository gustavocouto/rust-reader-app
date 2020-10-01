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
  route_icons = {
    '/reader': 'barcode-outline',
    '/labels': 'cube-outline',
    '/settings': 'settings-outline'
  }

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
    this.user = await this._contextService.user
  }

  ngOnInit() {

  }

  logout() {
    this._contextService.storage.clear()
    this._router.navigateByUrl('/account/login')
  }
}
