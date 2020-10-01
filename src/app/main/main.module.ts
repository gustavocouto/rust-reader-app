import { LOCALE_ID, NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ReaderComponent } from './reader/reader.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { Camera } from '@ionic-native/camera/ngx';
import { CommonModule, registerLocaleData } from '@angular/common';
import { LabelsComponent } from './labels/labels.component';
import { IngredientListComponent } from '../components/ingredient-list/ingredient-list.component';
import localePt from '@angular/common/locales/pt-PT'
import { LabelComponent } from './label/label.component';
import { SettingsComponent } from './settings/settings.component';

registerLocaleData(localePt);

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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt-PT' }
  ],
  declarations: [
    MainComponent,
    ReaderComponent,
    LabelComponent,
    LabelsComponent,
    SettingsComponent,
    ProfilePictureComponent,
    IngredientListComponent
  ],
  bootstrap: [MainComponent]
})
export class MainModule {}