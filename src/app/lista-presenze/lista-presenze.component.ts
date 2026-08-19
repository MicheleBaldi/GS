import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { AuthService } from '@auth0/auth0-angular';
import { getPresenzeSheetOptions, getSheetNameAggByRole, needsRuoloSelect } from '../lib/role.utils';
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
  presenzeAnnoCompleto:any = [];
  role:any;
  sheetName:any;
  showPresenze:any;
  expandedElement: any | null;
  obj:any;
  mesi:any = [];
  selectedMesi: string[] = [];
  objExpand:any;
  arrExpand:any = [];
  needsSelect = false;
  sheetOptions: { value: string; label: string }[] = [];
  selected = '';
  public displayedColumns = ['nome','presenze'];
  public detailDisplayedColumns = ['mesedesc','presenzemese'];

  constructor(
    private http: HttpClient, private dataService:DataService,public auth: AuthService,
    ) {}

  ngOnInit() {
    if(this.auth.isAuthenticated$)
      {
        this.role = this.dataService.currentUser.role[0];
        this.sheetName=getSheetNameAggByRole(this.role);
        this.needsSelect = needsRuoloSelect(this.role);
        if(this.needsSelect)
          {
            this.sheetOptions = getPresenzeSheetOptions(this.role);
            this.showPresenze = true;
          }
          else
          {
            this.reloadTable(this.sheetName)
          }
          
      }
  }

  reloadTable(sheetName:string)
  {
    this.showPresenze = false;
    this.presenzeAnno =[];
    this.presenzeAnnoCompleto = [];
    this.mesi = [];
    this.selectedMesi = [];
    this.expandedElement = null;
    const baseUrl = window.location.origin;
    this.http
        .get(`${baseUrl}/.netlify/functions/presenze?sheetName=${sheetName}&filterData=false`)
        .subscribe({
          next: (res: any) => {
            this.presenze = res.result;

            let lastIndex = this.presenze.values.length - 1;
            let presenzafirstrow = this.presenze.values[1];

            this.mesi = [];
            for(let i = 1; i <= presenzafirstrow.length-2; i++)
            {
              this.mesi.push(presenzafirstrow[i]);
            }
            this.selectedMesi = [...this.mesi];

            this.presenze.values.forEach((el,index)=>{
              this.obj={};
              
              if(index > 1)
              {
                if(index == lastIndex)
                {
                   el = el.slice(0, presenzafirstrow.length);
                }
                this.arrExpand =[];
                for(let i = 1; i <= presenzafirstrow.length-2; i++)
                {
                  this.objExpand ={};
                  this.objExpand["mesedesc"] = presenzafirstrow[i];
                  this.arrExpand.push(this.objExpand);
                }
                for(let i = 1; i < el.length-1; i++)
                {
                  this.arrExpand[i-1]["presenzemese"] = el[i];
                }
                this.obj["nome"] = el[0];
                this.obj["detailExpand"] = this.arrExpand;
                this.obj["isTotal"] = index == lastIndex;

                this.presenzeAnnoCompleto.push(this.obj);
              }
              
            })
            this.applyMonthFilter();
            this.showPresenze = true
          },
          error: (err) => {
            alert('ERROR: ' + err.error);
          },
        });
  }

  applyMonthFilter()
  {
    this.expandedElement = null;
    const filtered = this.presenzeAnnoCompleto.map((persona) => {
      const detailExpand = persona.detailExpand.filter((mese) =>
        this.selectedMesi.includes(mese.mesedesc)
      );
      const presenze = detailExpand.reduce((sum, mese) => {
        return sum + (Number(mese.presenzemese) || 0);
      }, 0);
      return {
        nome: persona.nome,
        presenze,
        detailExpand,
        isTotal: !!persona.isTotal,
      };
    });
    const persone = filtered.filter((row) => !row.isTotal)
      .sort((a, b) => b.presenze - a.presenze);
    const totali = filtered.filter((row) => row.isTotal);
    this.presenzeAnno = [...persone, ...totali];
  }
}
