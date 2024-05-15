import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {BreakpointObserver } from '@angular/cdk/layout' 
import { HttpClient } from '@angular/common/http';
import { DataService } from './service/data.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';

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
  imgProfile:string="/assets/gs.jpg";

  readonly VAPID_PUBLIC_KEY = "BLBx-hf2WrL2qEa0qKb-aCJbcxEvyn62GDTyyP9KTS5K7ZL0K7TfmOKSPqp8vQF0DaG8hpSBknz_x3qf5F4iEFo";

    

  constructor(private observer: BreakpointObserver,
    private http: HttpClient,
    public dataService: DataService,
    public auth: AuthService,
    private router:Router,
    private swPush: SwPush) {}

    subscribeToNotifications() {
debugger;
      this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(
        sub => 
        this.http
      .post(`${window.location.origin}/.netlify/functions/subnotification`, {'personaid':this.dataService.currentUser.personaid, 'sub':JSON.stringify(sub)})
      .subscribe({
        next: (res: any) => {
          alert(res.message);
        },
        error: (err) => {
          alert('ERROR: ' + err.error);
        },
      })
      )
      .catch(err => console.error("Could not subscribe to notifications", err));
  }

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
              const baseUrl = window.location.origin;
              if(this.user.personaid != null)
              {
                this.http
                .post(`${baseUrl}/.netlify/functions/persone`, {'personaid':this.user.personaid})
                .subscribe({
                  next: (res: any) => {
                    this.persona = res;
                    this.dataService.isAuthenticate = true;
                    if(this.persona.persona.fields['Foto Profilo'].length > 0)
                      {
                        this.imgProfile= this.persona.persona.fields['Foto Profilo'][0].url;
                      }
                     this.subscribeToNotifications();
                  },
                  error: (err) => {
                    alert('ERROR: ' + err.error);
                  },
                });
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
