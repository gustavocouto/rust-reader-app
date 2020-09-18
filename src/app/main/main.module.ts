import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ReaderComponent } from './reader/reader.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { Camera } from '@ionic-native/camera/ngx';
import { CommonModule } from '@angular/common';
import { LabelsComponent } from './labels/labels.component';

@NgModule({
  entryComponents: [],
  imports: [
    IonicModule.forRoot(),
    MainRoutingModule,
    CommonModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  declarations: [
    MainComponent,
    ReaderComponent,
    LabelsComponent,
    ProfilePictureComponent
  ],
  bootstrap: [MainComponent]
})
export class MainModule {}