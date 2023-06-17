import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsciteComponent } from './lista-uscite/lista-uscite.component';

const routes: Routes = [
  {
		path: '',
		component: ListaUsciteComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
