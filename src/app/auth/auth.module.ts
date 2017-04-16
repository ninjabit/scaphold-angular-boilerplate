import {ModuleWithProviders, NgModule} from '@angular/core';
import { AuthComponent } from './auth.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';

const authRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'register',
    component: AuthComponent
  }
]);

@NgModule({
  imports: [
    authRouting,
    SharedModule
  ],
  declarations: [AuthComponent],
  providers: []
})
export class AuthModule { }
