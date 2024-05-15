import { Component } from '@angular/core';
import { IUscita } from '../model/uscita.model';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '@auth0/auth0-angular';
import { DataService } from '../service/data.service';


@Component({
  selector: 'app-lista-uscite',
  templateUrl: './lista-uscite.component.html',
  styleUrls: ['./lista-uscite.component.scss']
})
export class ListaUsciteComponent {
  uscite: any;
  public displayedColumns = ['titolo','luogo','actions'];
  constructor(private http: HttpClient,public auth: AuthService, public dataService: DataService) { }

  ngOnInit(): void {
    if(this.auth.isAuthenticated$)
    {
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
    (event.target as HTMLButtonElement).disabled = true;
    const baseUrl = window.location.origin;
    this.http
      .post(`${baseUrl}/.netlify/functions/iscrizioneuscita`, {'persona':this.dataService.currentUser.personaid, 'uscita':eventData.id})
      .subscribe({
        next: (res: any) => {
          let uscitaid = eventData.id;
          let uscita = this.uscite.uscite.filter(x=>x.id == uscitaid)
          uscita[0].fields.Partecipanti.push(this.dataService.currentUser.personaid);
          alert(res.message);
          (event.target as HTMLButtonElement).disabled = false;
        },
        error: (err) => {
          alert('ERROR: ' + err.error);
          (event.target as HTMLButtonElement).disabled = false;
        },
      });
  }

}
