import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {BreakpointObserver } from '@angular/cdk/layout' 
import { HttpClient } from '@angular/common/http';
import { DataService } from './service/data.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { PersistanceService } from './service/persistance.service';
import { getSheetNameAggByRuoloAirtable } from './lib/role.utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PushNotificationService } from './service/push-notification.service';
import { PushPromptComponent } from './push-prompt/push-prompt.component';


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
  sheetName:any;
  numPresenze:any;
  provaTotali:any;
  private pushPromptOpened = false;

  constructor(private observer: BreakpointObserver,
    private http: HttpClient,
    public dataService: DataService,
    public auth: AuthService,
    private router:Router,
    private persister: PersistanceService,
    private modalService: NgbModal,
    private pushService: PushNotificationService) {}

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
                      if('Foto Profilo' in this.persona.persona.fields && this.persona.persona.fields['Foto Profilo'].length > 0)
                        this.imgProfile= this.persona.persona.fields['Foto Profilo'][0].url;
                      this.loadPresenzeSummary(baseUrl);
                      this.maybeShowPushPrompt();
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
                  if('Foto Profilo' in this.persona.persona.fields && this.persona.persona.fields['Foto Profilo'].length > 0)
                  this.imgProfile= this.persona.persona.fields['Foto Profilo'][0].url;
                  this.loadPresenzeSummary(baseUrl);
                  this.maybeShowPushPrompt();
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

  private loadPresenzeSummary(baseUrl: string) {
    this.sheetName = getSheetNameAggByRuoloAirtable(this.persona?.persona?.fields?.['Ruolo']);
    if (!this.sheetName) {
      return;
    }
    this.http
      .get(`${baseUrl}/.netlify/functions/presenze?sheetName=${this.sheetName}&filterData=false`)
      .subscribe({
        next: (res: any) => {
          let presenzafirstrow = res.result.values[1];
          let presenzaLastRow = res.result.values.at(-1).slice(0, presenzafirstrow.length);

          this.numPresenze = res.result.values.find(item => item[0] === this.persona.persona.fields['Nome']).at(-1);
          this.provaTotali = presenzaLastRow.at(-1);
        },
        error: (err) => {
          alert('ERROR: ' + err.error);
        },
      });
  }

  private maybeShowPushPrompt() {
    if (this.pushPromptOpened || !this.pushService.shouldPrompt()) {
      return;
    }
    this.pushPromptOpened = true;
    setTimeout(() => {
      const ref = this.modalService.open(PushPromptComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true
      });
      ref.componentInstance.personaid = this.user?.personaid || null;
    }, 0);
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
