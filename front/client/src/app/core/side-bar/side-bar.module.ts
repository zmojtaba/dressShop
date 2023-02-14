import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SideBarRoutingModule } from './side-bar-routing.module';
import { SideBarComponent } from './side-bar.component';


@NgModule({
  declarations: [
    SideBarComponent
  ],
  imports: [
    CommonModule,
    SideBarRoutingModule
  ],

  exports: [
    SideBarComponent,
  ]
})
export class SideBarModule { }
