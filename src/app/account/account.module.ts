import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { IonicStorageModule } from '@ionic/storage';
import { AccountComponent } from './account.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountRoutingModule
  ],
  declarations: [
    AccountComponent,
    LoginComponent,
    RegisterComponent
  ],
  bootstrap: [AccountComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule {}
