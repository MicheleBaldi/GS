import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsciteComponent } from './lista-uscite/lista-uscite.component';
import { LoginButtonComponent } from './auth/login-button/login-button.component';

const routes: Routes = [
  {
		path: '',
		component: LoginButtonComponent
	},
  {
		path: 'lista-uscite',
		component: ListaUsciteComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
