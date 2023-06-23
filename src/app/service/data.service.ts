import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Injectable()
export class DataService {

  currentUser: any;
  isAuthenticate: boolean = false;

  constructor(public auth: AuthService) { }
  
  updateUserData(){
    this.auth.user$.subscribe(data => this.currentUser = data);
  }

  isAuth(){
    
  }

}