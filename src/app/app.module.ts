import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppHttpInterceptor } from './app-http.interceptor';
import { loadUser, loadIngredients } from './services/app-startup.service';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { ContextService } from './services/context.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@NgModule({
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({ name: '__rustreader', driverOrder: ['indexeddb', 'sqllite', 'websql'] }),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundMode,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: loadUser, deps: [Injector, ContextService], multi: true },
    { provide: APP_INITIALIZER, useFactory: loadIngredients, deps: [Injector, ContextService], multi: true }
  ],
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent
  ]
})
export class AppModule {}
