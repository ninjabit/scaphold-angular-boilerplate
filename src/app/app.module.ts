import {BrowserModule} from '@angular/platform-browser';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ApolloModule} from 'apollo-angular';

import {AppComponent} from './app.component';
import {FooterComponent} from './shared/layout/footer/footer.component';
import {HeaderComponent} from './shared/layout/header/header.component';

import {RouterModule} from '@angular/router';
import {
  SharedModule
} from './shared';
import {HomeModule} from './home/home.module';
import {AuthModule} from './auth/auth.module';
import {provideClient} from './client';
import {AuthService} from './shared/services/auth.service';
import {JwtService} from './shared/services/jwt.service';
import {ProfileModule} from './profile/profile.module';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([], {useHash: true});
const apolloRouting: ModuleWithProviders = ApolloModule.forRoot(provideClient);

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AuthModule,
    HomeModule,
    ProfileModule,
    rootRouting,
    apolloRouting,
  ],
  providers: [
    JwtService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
