import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { PersistanceService } from './persistance.service';

@Injectable()
export class DataService {

  currentUser: any;
  persona:any;
  isAuthenticate: boolean = false;

  constructor(public auth: AuthService, private persister: PersistanceService) { }

  logout(): void {
    this.persister.remove('PERSONA');
    this.persona = null;
    this.currentUser = null;
    this.isAuthenticate = false;
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}