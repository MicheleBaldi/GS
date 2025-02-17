import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {BreakpointObserver } from '@angular/cdk/layout' 
import { HttpClient } from '@angular/common/http';
import { DataService } from './service/data.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { PersistanceService } from './service/persistance.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GsApp';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  persona:any;
  user:any;
  imgProfile:string="/assets/gs.png";
  showInsPresenze:any;

  constructor(private observer: BreakpointObserver,
    private http: HttpClient,
    public dataService: DataService,
    public auth: AuthService,
    private router:Router,
    private persister: PersistanceService) {}

  ngOnInit(){
    this.auth.isAuthenticated$.subscribe({
        next: (isAuthenticated) => {
         if(!isAuthenticated)
         {
          this.router.navigate(['/login']);
         }
         else 
         {
          this.auth.user$.subscribe({
            next:(data)=>{
              this.user = data;
              this.dataService.currentUser = this.user;
              this.showInsPresenze = this.dataService.currentUser.role.length > 0
              const baseUrl = window.location.origin;
              debugger;
              if(this.user.personaid != null)
              {
                if(this.persister.get('PERSONA') == null)
                {
                  this.http
                  .post(`${baseUrl}/.netlify/functions/persone`, {'personaid':this.user.personaid})
                  .subscribe({
                    next: (res: any) => {
                      this.persona = res;
                      this.persister.set('PERSONA', this.persona);
                      this.dataService.persona = res;
                      this.dataService.isAuthenticate = true;
                      if(this.persona.persona.fields['Foto Profilo'].length > 0)
                        this.imgProfile= this.persona.persona.fields['Foto Profilo'][0].url;
                    },
                    error: (err) => {
                      alert('ERROR: ' + err.error);
                    },
                  });
                }
                else
                {
                  this.persona = this.persister.get('PERSONA');
                  this.dataService.persona = this.persona;
                  this.dataService.isAuthenticate = true;
                  if(this.persona.persona.fields['Foto Profilo'].length > 0)
                  this.imgProfile= this.persona.persona.fields['Foto Profilo'][0].url;
                }
              }
              else
              {
                this.router.navigate(['/seleziona-persona']);
              }
            }
          })
         }
        },
        error: (msg) => {
          console.log('error')
        }
      })
    
  }

  ngAfterViewInit() {
    this.observer.observe(["(max-width: 800px)"]).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = "over";
        this.sidenav.close();
      } else {
        this.sidenav.mode = "side";
        this.sidenav.open();
      }
    });

  }
  
}
