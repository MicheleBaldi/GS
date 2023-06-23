import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '@auth0/auth0-angular';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lista-uscite-iscritto',
  templateUrl: './lista-uscite-iscritto.component.html',
  styleUrls: ['./lista-uscite-iscritto.component.scss']
})
export class ListaUsciteIscrittoComponent {
  uscite: any;
  usciteiscitto: any;

  constructor(private http: HttpClient,public auth: AuthService, public dataService: DataService,private router:Router) { }

  ngOnInit(): void {
    debugger;
    if(this.auth.isAuthenticated$)
    {
      if(this.dataService.currentUser === undefined)
      {
        this.router.navigate(['/']);
      }
      const baseUrl = window.location.origin;
      this.http
        .get(`${baseUrl}/.netlify/functions/uscite`)
        .subscribe({
          next: (res: any) => {
            this.uscite = res;
            this.usciteiscitto = this.uscite.uscite.filter(x=> x.fields.Partecipanti.includes(this.dataService.currentUser.personaid));
          },
          error: (err) => {
            alert('ERROR: ' + err.error);
          },
        });
    }
  }

}
