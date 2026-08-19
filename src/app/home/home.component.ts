import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DataService } from '../service/data.service';
import { HttpClient } from '@angular/common/http';
import { PushNotificationService } from '../service/push-notification.service';

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
    private pushService: PushNotificationService
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
        // #region agent log
        fetch('http://127.0.0.1:7426/ingest/c582076e-daa3-46f3-b028-fea869801e45',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0484f6'},body:JSON.stringify({sessionId:'0484f6',hypothesisId:'A,B,C,E',location:'home.component.ts:inviaNotificaEsempio',message:'send-push response',data:{message:res?.message,sent:res?.sent,total:res?.total,errors:res?.errors,vapidMeta:res?.vapidMeta},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        alert(res.message || 'Notifica inviata');
        this.pushBusy = false;
      },
      error: (err) => {
        // #region agent log
        fetch('http://127.0.0.1:7426/ingest/c582076e-daa3-46f3-b028-fea869801e45',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0484f6'},body:JSON.stringify({sessionId:'0484f6',hypothesisId:'E',location:'home.component.ts:inviaNotificaEsempio',message:'send-push http error',data:{status:err?.status,error:err?.error,httpMessage:err?.message},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        alert('ERROR: ' + (err?.error || err?.message || err));
        this.pushBusy = false;
      }
    });
  }
}
