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
  route: string
  loading: boolean
  route_icons = {
    '/reader': 'barcode-outline',
    '/labels': 'list-outline',
    '/preferences': 'flask-outline',
    '/settings': 'person-outline'
  }

  constructor(
    private _router: Router,
    private _menu: MenuController,
    public context: ContextService) {
    context.onLoadingChange.subscribe(loading => this.loading = loading)
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
    this.context.storage.clear()
    this.context.setLogout()
    this._router.navigateByUrl('/account/login')
  }
}
