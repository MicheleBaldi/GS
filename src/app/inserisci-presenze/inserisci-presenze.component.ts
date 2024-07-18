import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DataService } from '../service/data.service';
import { getRuoloPersone, getSheetNameByRole } from '../lib/role.utils';


@Component({
  selector: 'app-inserisci-presenze',
  templateUrl: './inserisci-presenze.component.html',
  styleUrls: ['./inserisci-presenze.component.scss']
})
export class InserisciPresenzeComponent {
  formPresenze: FormGroup =  new FormGroup({}); 
  showForm =false;
  presenzeCurrent:any;
  personeArr:any;
  role:any;
  sheetName:any;
  ruoloPersone:any
  isDisabled:any=false;

  public displayedColumns = ['Nome','actions'];

  constructor(
    private _formBuilder: FormBuilder,private http: HttpClient, private dataService:DataService
    ) {}

  ngOnInit() {
    this.role = this.dataService.currentUser.role[0];
    this.sheetName=getSheetNameByRole(this.role);
    this.ruoloPersone = getRuoloPersone(this.role);

    this.formPresenze = this._formBuilder.group({
      data: [undefined, Validators.required],
      persone: this._formBuilder.array([])
    });

    const baseUrl = window.location.origin;
        this.http
          .get(`${baseUrl}/.netlify/functions/personelist?ruolo=${this.ruoloPersone}`)
          .subscribe({
            next: (res: any) => {
              this.personeArr = res.persone;
              res.persone.forEach(element => {
                const fg = new FormGroup({
                  id: new FormControl(element.id),
                  nome: new FormControl(element.fields.Nome),
                  presente: new FormControl()
                });

                this.persone.push(fg);
              });
              this.showForm = true;
            },
            error: (err) => {
              alert('ERROR: ' + err.error);
            },
          });
  }

  get persone(): FormArray {
    return this.formPresenze.get('persone') as FormArray;
  }

  showOptions(event:MatCheckboxChange,element:any): void {
    console.log(event.checked);
  }

  submit(){
    this.isDisabled = true;
    const formModel = this.formPresenze.value;
    let presenti:any = [];
    this.formPresenze.value.persone.filter(x=>x.presente == true).forEach(el =>{
      let presenza = [formModel.data.toLocaleDateString("en-GB"), el.id, el.nome];
      presenti.push(presenza);
    })
    const baseUrl = window.location.origin;
    this.http
      .post(`${baseUrl}/.netlify/functions/inserisci-presenze`, {presenti:presenti,sheetName:this.sheetName,currentPresenti: this.presenzeCurrent})
      .subscribe({
        next: (res: any) => {
          alert(res.message);
          this.resetForm(true);
          this.isDisabled = false;
        },
        error: (err) => {
          alert('ERROR: ' + err.error);
          this.isDisabled = false;
        },
      });
  }

  valueChanged(event: MatDatepickerInputEvent<Date>){
    this.showForm = false;
    this.resetForm(false);
    const personeArr = this.formPresenze.controls['persone'] as FormArray;
    const baseUrl = window.location.origin;
    const date = event.value != null ? event.value : new Date();

    this.http
      .get(`${baseUrl}/.netlify/functions/presenze?sheetName=${this.sheetName}&datePresenze=${date.toLocaleDateString('en-GB')}`)
      .subscribe({
        next: (res: any) => {
          this.presenzeCurrent = res.result.values
          res.result.currentPres.forEach(el=>{
                const p = personeArr.controls.filter(x=>x.value.id == el[1])[0] as FormGroup;
                p.controls['presente'].setValue(true);
          })
          this.showForm = true
        },
        error: (err) => {
          alert('ERROR: ' + err.error);
        },
      });
  }

  private resetForm(resetData:boolean) {
    if(resetData)
    {
      this.formPresenze.controls['data'].reset();
    }
    const control = <FormArray>this.formPresenze.controls['persone'];
    for (let i = 0; i < this.personeArr.length; i++) {
      const obj = Object.assign({}, this.personeArr[i]) as any;
      control.controls[i].reset({ id: obj.id, nome: obj.fields.Nome });
    }
  }
}
