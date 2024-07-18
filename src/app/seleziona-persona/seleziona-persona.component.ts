import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-seleziona-persona',
  templateUrl: './seleziona-persona.component.html',
  styleUrls: ['./seleziona-persona.component.scss']
})
export class SelezionaPersonaComponent {
  constructor(private formBuilder: FormBuilder,public auth: AuthService,private http: HttpClient,public dataService: DataService,private router:Router){
  }
  peopleForm = this.formBuilder.group({
    peopleList:null
  });
  selectedPeople: string = "";
  
  selectedPeopleControl = new FormControl(this.selectedPeople);

  people: any = [
    {personaid:"", nome:""}
  ];
  
  ngOnInit() {
    if(this.auth.isAuthenticated$)
      {
        const baseUrl = window.location.origin;
        this.http
          .get(`${baseUrl}/.netlify/functions/personelist`)
          .subscribe({
            next: (res: any) => {
              this.people = res.persone.map(c => {
                return { personaid: c.id, nome: c.fields.Nome };
              });
            },
            error: (err) => {
              alert('ERROR: ' + err.error);
            },
          });
      }
    }
  
  onSubmit() {
    const baseUrl = window.location.origin;
    this.http
    .post(`${baseUrl}/.netlify/functions/token`,{}).subscribe({
      next:(data)=>{

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data['message']['access_token']}`
        });
      
        const requestOptions = { headers: headers };
        const userId = this.dataService.currentUser.sub;
      
        const url =`https://${environment.auth0.domain}/api/v2/users/${userId}`;
        this.http
          .patch(url, {"user_metadata": {"personaid": this.selectedPeople}}, requestOptions)
          .subscribe((res: any) => {
            this.router.navigate(['']).then(() => {
              window.location.reload();
            });
          });
        },error: (err) => {
          alert('ERROR: ' + err.error);
        },
    });
  }
}
