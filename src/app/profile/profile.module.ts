import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import {RouterModule} from '@angular/router';

const profileRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: 'profile/:username',
    component: ProfileComponent
  }
]);

@NgModule({
  imports: [
    CommonModule,
    profileRouting
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }
