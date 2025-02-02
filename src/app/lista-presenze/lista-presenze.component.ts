import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { AuthService } from '@auth0/auth0-angular';
import { getSheetNameAggByRole } from '../lib/role.utils';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-lista-presenze',
  templateUrl: './lista-presenze.component.html',
  styleUrls: ['./lista-presenze.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*', minHeight: "*"})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ListaPresenzeComponent {
  presenze: any;
  presenzeAnno:any = [];
  role:any;
  sheetName:any;
  showPresenze:any;
  expandedElement: any | null;
  obj:any;
  mesi:any = [];

  public displayedColumns = ['nome','presenze'];

  constructor(
    private http: HttpClient, private dataService:DataService,public auth: AuthService,
    ) {}

  ngOnInit() {
    if(this.auth.isAuthenticated$)
      {
        this.role = this.dataService.currentUser.role[0];
        this.sheetName=getSheetNameAggByRole(this.role);
        const baseUrl = window.location.origin;
        this.http
        .get(`${baseUrl}/.netlify/functions/presenze?sheetName=${this.sheetName}&filterData=false`)
        .subscribe({
          next: (res: any) => {
            debugger;
            this.presenze = res.result;
            this

            this.presenze.values.forEach((el,index)=>{
              this.obj={};
              let presenzafirstrow = this.presenze.values[1]
              if(index == 1)
              {
                for(let i = 1; i <= el.length-2; i++)
                {
                  this.mesi.push(i);
                }
              }
              if(index > 1)
              {
                for(let i = 1; i <= presenzafirstrow.length-2; i++)
                  {
                    this.obj["mesedesc_"+i] = presenzafirstrow[i];
                  }
                this.obj["nome"] = el[0];
                this.obj["presenze"] = el[el.length - 1];
                for(let i = 1; i < el.length-1; i++)
                {
                  this.obj["mese_"+i] = el[i];
                }
                this.presenzeAnno.push(this.obj);
              }
              
            })
            this.showPresenze = true
          },
          error: (err) => {
            alert('ERROR: ' + err.error);
          },
        });

      }
  }
  rowClick(row:any)
  {
    console.log("click row")
  }

}
