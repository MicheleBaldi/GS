import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '@auth0/auth0-angular';
import { DataService } from '../service/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-lista-uscite',
  templateUrl: './lista-uscite.component.html',
  styleUrls: ['./lista-uscite.component.scss']
})
export class ListaUsciteComponent {
  uscite: any;
  saggi: any;
  modalTitle:any;
  saggiPersona:any;
  showUscite=false;

  public displayedColumns = ['titolo','luogo','actions'];
  AnagSaggi: Array<any> = [{'id':'recPHrbntIqFS0d8D','nome':'Margherita 1'},
  {'id':'recjhMclDTRsPpcel','nome':'Margherita 2'},
  {'id':'recMYm1OMZObW72ji','nome':'Saggio a 4'},
  {'id':'reciT2bTVI8PltiQs','nome':'Saggio a 8'},
  {'id':'rechcatKq0NgbX2Mi','nome':'Saggio a 6'},
  {'id':'reciRfgwFK0vqYQhf','nome':'Coppia'},
  {'id':'recHxJ4amkFruIJdG','nome':'Singolo'},
  {'id':'recIvQvYwRGpRm9V5','nome':'Finale'},
  {'id':'recxZGIOLNhHjfUN4','nome':'Sfilata'},
  {'id':'rec3MRsGvVJdxW8DW','nome':'Lunghe'},];

  AnagRuoli: Array<any> = [{'id':'recGVCrLdOBdeNCGH','nome':'Rullante'},
    {'id':'recKUU6R3KFN8eqak','nome':'Timpano'},
    {'id':'recAgaYpmMJM6EcZQ','nome':'Inizio Meravigliosa'},
    {'id':'recH1E2fBXkhhe4cR','nome':'Inizio Torsida'},
    {'id':'recpXI91fvkFseNZT','nome':'Doppi Passo'},
    {'id':'recPQ3DKhhiFLIMT8','nome':'Doppi Torsida'},];

 constructor(private http: HttpClient,public auth: AuthService, public dataService: DataService, public modalService:NgbModal) { }

  ngOnInit(): void {
    if(this.auth.isAuthenticated$)
    {
      this.saggiPersona=[];
      const baseUrl = window.location.origin;
      this.http
        .get(`${baseUrl}/.netlify/functions/uscite`)
        .subscribe({
          next: (res: any) => {
            this.uscite = res;
            if(this.dataService.persona.persona.fields.Ruolo =='Sbandieratore')
              {
                this.modalTitle="Saggi Assegnati";
                this.http
                  .get(`${baseUrl}/.netlify/functions/saggisbandieratori`)
                  .subscribe({
                    next:(r:any)=>{
                      this.saggi = r.saggi.filter(x=> x.fields.Presenti.includes(this.dataService.currentUser.personaid));
                      this.uscite.uscite.forEach(element => {
                        element.fields.saggiUscita=[];
                        if(element.fields['Saggi Pronti'])
                          {
                            let saggiUscita = this.saggi.filter(x=> x.fields.Uscita.includes(element.id));
                            if(saggiUscita.length > 0 && saggiUscita[0].fields['Saggi Assegnati'] != null)
                              {
                                saggiUscita[0].fields['Saggi Assegnati'].forEach(e=>{
                                  element.fields.saggiUscita.push(this.AnagSaggi.filter(x=>x.id == e)[0]);
                                });
                              }
                              else
                              {
                                element.fields.saggiUscita=[{'id':'','nome':'Nessun saggio assegnato'}];
                              }
                          }
                          else
                          {
                            element.fields.saggiUscita=[{'id':'','nome':'Saggi non ancora assegnati'}];
                          }
                          this.showUscite = true;
                      });
                    },
                    error: (err) => {
                      alert('ERROR: ' + err.error);
                    },
                });
              }
              if(this.dataService.persona.persona.fields.Ruolo =='Tamburino')
              {
                this.modalTitle="Ruoli Uscita";
                this.http
                .get(`${baseUrl}/.netlify/functions/ruolitamburi`)
                .subscribe({
                  next:(r:any)=>{
                    this.saggi = r.ruoliTamburi.filter(x=> x.fields.Presenti.includes(this.dataService.currentUser.personaid));
                    this.uscite.uscite.forEach(element => {
                      element.fields.saggiUscita=[];
                      if(element.fields['Ruoli Pronti'])
                      {
                        let saggiUscita = this.saggi.filter(x=> x.fields.Uscita.includes(element.id));
                        if(saggiUscita.length > 0 && saggiUscita[0].fields['Ruolo Tamburino Assegnato'] != null)
                        {
                          saggiUscita[0].fields['Ruolo Tamburino Assegnato'].forEach(e=>{
                            element.fields.saggiUscita.push(this.AnagRuoli.filter(x=>x.id == e)[0]);
                          });
                        }
                        else
                        {
                          element.fields.saggiUscita=[{'id':'','nome':'Nessun ruolo assegnato'}];
                        }
                      }
                      else
                      {
                        element.fields.saggiUscita=[{'id':'','nome':'Ruoli non ancora assegnati'}];
                      }
                        this.showUscite = true;
                    });
                  },
                  error: (err) => {
                    alert('ERROR: ' + err.error);
                  },
                });
              }
              if(this.dataService.persona.persona.fields.Ruolo =='Chiarina')
              {
                this.modalTitle="Ruoli Uscita";
                this.uscite.uscite.forEach(element => {
                  element.fields.saggiUscita=[{'id':'','nome':'PEPEREPPE'}];
                });
                this.showUscite = true;
              }
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
          if(uscita[0].fields.Partecipanti == null)
            {
              uscita[0].fields.Partecipanti=[];
            }
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

  open(content: any, element:any) {
    this.saggiPersona= element.fields.saggiUscita
    this.modalService.open(content);
  }

  closeModal() {
    this.saggiPersona=[];
    this.modalService.dismissAll();
  }

}
