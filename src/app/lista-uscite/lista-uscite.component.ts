import { Component } from '@angular/core';
import { IUscita } from '../model/uscita.model';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '@auth0/auth0-angular';


@Component({
  selector: 'app-lista-uscite',
  templateUrl: './lista-uscite.component.html',
  styleUrls: ['./lista-uscite.component.scss']
})
export class ListaUsciteComponent {
  uscite: any;
  currentUser: any;
  public displayedColumns = ['titolo', 'data','luogo','actions'];
  constructor(private http: HttpClient,public auth: AuthService) { }

  ngOnInit(): void {
    if(this.auth.isAuthenticated$)
    {
      this.auth.user$.subscribe(data => this.currentUser = data);
      const baseUrl = window.location.origin;
      this.http
        .get(`${baseUrl}/.netlify/functions/uscite`)
        .subscribe({
          next: (res: any) => {
            this.uscite = res;
          },
          error: (err) => {
            alert('ERROR: ' + err.error);
          },
        });
    }
  }
  onActionButtonClick(event: Event, eventData: any)
  { 
    const baseUrl = window.location.origin;
    this.http
      .post(`${baseUrl}/.netlify/functions/iscrizioneuscita`, {'persona':this.currentUser.personaid, 'uscita':eventData.id})
      .subscribe({
        next: (res: any) => {
          alert(res.message);
        },
        error: (err) => {
          alert('ERROR: ' + err.error);
        },
      });
  }

}
