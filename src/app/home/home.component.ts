import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DataService } from '../service/data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showInsPresenze:any = false;
  constructor(public auth: AuthService, private router:Router, public dataService:DataService,private http: HttpClient,) { }

  ngOnInit(): void {
    this.auth.user$.subscribe({
      next:(data)=>{
        this.dataService.currentUser = data;
        this.showInsPresenze = this.dataService.currentUser.role.length > 0
      }
    });
  }
}
