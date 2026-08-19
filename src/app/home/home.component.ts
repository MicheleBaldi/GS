import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DataService } from '../service/data.service';
import { HttpClient } from '@angular/common/http';
import { PushNotificationService } from '../service/push-notification.service';
import { PwaInstallService } from '../service/pwa-install.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showInsPresenze:any = false;
  pushBusy = false;

  constructor(
    public auth: AuthService,
    private router:Router,
    public dataService:DataService,
    private http: HttpClient,
    private pushService: PushNotificationService,
    public pwa: PwaInstallService
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe({
      next:(data)=>{
        this.dataService.currentUser = data;
        this.showInsPresenze = this.dataService.currentUser.role.length > 0
      }
    });
  }

  inviaNotificaEsempio() {
    this.pushBusy = true;
    this.pushService.sendExampleNotification().subscribe({
      next: (res: any) => {
        alert(res.message || 'Notifica inviata');
        this.pushBusy = false;
      },
      error: (err) => {
        alert('ERROR: ' + (err?.error || err?.message || err));
        this.pushBusy = false;
      }
    });
  }
}
