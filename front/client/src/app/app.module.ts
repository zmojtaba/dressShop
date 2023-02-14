import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NbThemeModule , NbSidebarModule, NbLayoutModule, NbButtonModule } from '@nebular/theme';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import {MatIconModule} from '@angular/material/icon'
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NbThemeModule.forRoot(),
    NbLayoutModule,
    NbSidebarModule.forRoot(),
    NbButtonModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    MatIconModule
  ],
  providers: [   {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
   }],
  bootstrap: [AppComponent]
})
export class AppModule { }
