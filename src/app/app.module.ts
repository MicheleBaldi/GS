import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaUsciteComponent } from './lista-uscite/lista-uscite.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMaterialModule } from './ng-material/ng-material.module'
import { AuthModule } from '@auth0/auth0-angular';
import { environment as env } from '../environments/environment';
import { LoginButtonComponent } from './auth/login-button/login-button.component';
import { LogoutButtonComponent } from './auth/logout-button/logout-button.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ListaUsciteIscrittoComponent } from './lista-uscite-iscritto/lista-uscite-iscritto.component';
import { HomeComponent } from './home/home.component';
import { DataService } from './service/data.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelezionaPersonaComponent } from './seleziona-persona/seleziona-persona.component';
import {MatSelectModule} from '@angular/material/select';
import { InserisciPresenzeComponent } from './inserisci-presenze/inserisci-presenze.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatDatepickerModule,} from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { ListaPresenzeComponent } from './lista-presenze/lista-presenze.component';
import { PersistanceService } from './service/persistance.service';
import { ConvocazioneComponent } from './convocazione/convocazione.component';
import { PushNotificationService } from './service/push-notification.service';
import { PushPromptComponent } from './push-prompt/push-prompt.component';




@NgModule({
  declarations: [
    AppComponent,
    ListaUsciteComponent,
    LoginButtonComponent,
    LogoutButtonComponent,
    ListaUsciteIscrittoComponent,
    HomeComponent,
    SelezionaPersonaComponent,
    InserisciPresenzeComponent,
    ListaPresenzeComponent,
    ConvocazioneComponent,
    PushPromptComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AuthModule.forRoot({
      ...env.auth0,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgbModule,
  ],
  providers: [DataService, PersistanceService, PushNotificationService, MatDatepickerModule, MatNativeDateModule,{provide: MAT_DATE_LOCALE, useValue: 'it-IT'}  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
