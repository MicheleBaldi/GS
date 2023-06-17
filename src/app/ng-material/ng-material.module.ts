import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

const sharedModule = [
  MatButtonModule,
  MatListModule,
  MatIconModule,
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    sharedModule
  ], 
  exports : [
    sharedModule
  ]
})
export class NgMaterialModule { }