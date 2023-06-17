import { Component } from '@angular/core';
import { IUscita } from '../model/uscita.model';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-lista-uscite',
  templateUrl: './lista-uscite.component.html',
  styleUrls: ['./lista-uscite.component.scss']
})
export class ListaUsciteComponent {
  uscite: any;
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const baseUrl = window.location.origin;
    this.http
      .get(`${baseUrl}/.netlify/functions/uscite`)
      .subscribe({
        next: (res: any) => {
          debugger;
          this.uscite = res;
        },
        error: (err) => {
          alert('ERROR: ' + err.error);
        },
      });
  }
}
