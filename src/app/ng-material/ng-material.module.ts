import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table'  

const sharedModule = [
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatTableModule,
  MatButtonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatDividerModule,
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