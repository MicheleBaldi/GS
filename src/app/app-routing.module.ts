import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsciteComponent } from './lista-uscite/lista-uscite.component';
import { LoginButtonComponent } from './auth/login-button/login-button.component';
import { HomeComponent } from './home/home.component';
import { ListaUsciteIscrittoComponent } from './lista-uscite-iscritto/lista-uscite-iscritto.component';
import { SelezionaPersonaComponent } from './seleziona-persona/seleziona-persona.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
    {
		path: 'login',
		component: LoginButtonComponent
	},
    {
		path: 'lista-uscite',
		component: ListaUsciteComponent
	},
	{
		path: 'lista-uscite-iscritto',
		component: ListaUsciteIscrittoComponent
	},
	{
		path: 'seleziona-persona',
		component: SelezionaPersonaComponent
	}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
