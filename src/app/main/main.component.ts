import { Component, OnInit } from '@angular/core';
import { ContextService } from '../services/context.service';
import { Router, NavigationEnd } from '@angular/router';
import { IUser } from '../interfaces/IUser';
import { MenuController } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'main-root',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss']
})
export class MainComponent implements OnInit {
  user: IUser
  route: string
  loading: boolean
  route_icons = {
    '/reader': 'barcode-outline',
    '/labels': 'cube-outline',
    '/preferences': 'grid-outline',
    '/settings': 'person-outline'
  }

  constructor(
    private _router: Router,
    private _menu: MenuController,
    private _contextService: ContextService) {
    this.user = this._contextService.user
    _contextService.onLoadingChange.subscribe(loading => this.loading = loading)
    _router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.route = e.url
        _menu.close()
      }
    })
  }

  ngOnInit() {
    
  }

  logout() {
    this._contextService.storage.clear()
    this._router.navigateByUrl('/account/login')
  }
}
