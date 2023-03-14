import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { SideBarModule } from './side-bar/side-bar.module';
import { SideBarComponent } from './side-bar/side-bar.component';
import { NbDialogModule } from '@nebular/theme';




@NgModule({
  declarations: [
    HeaderComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    SideBarModule,
    NbDialogModule.forRoot(),

  ],
  exports: [
    HeaderComponent,
    SideBarComponent
  ]
})
export class CoreModule { }
