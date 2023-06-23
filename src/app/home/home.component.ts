import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(public auth: AuthService, private router:Router, private dataService:DataService) { }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe({
      next: (isAuthenticated) => {
       if(!isAuthenticated)
       {
        this.router.navigate(['/login']);
       }
       else 
       {
        this.dataService.updateUserData();
       }
      },
      error: (msg) => {
        console.log('error')
      }
    })
  }
}
