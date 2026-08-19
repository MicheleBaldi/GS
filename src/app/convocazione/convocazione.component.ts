import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { forkJoin } from 'rxjs';
import { DataService } from '../service/data.service';
import {
  getRuoloOptions,
  getRuoloPersone,
} from '../lib/role.utils';

@Component({
  selector: 'app-convocazione',
  templateUrl: './convocazione.component.html',
  styleUrls: ['./convocazione.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConvocazioneComponent {
  uscite: any[] = [];
  showUscite = false;
  expandedElement: any | null = null;
  role: string = '';
  operativeRole: string = '';
  needsSelect = false;
  ruoloOptions: { value: string; label: string }[] = [];
  selectedRuolo = '';
  ruoloPersoneFilter = '';
  iscrittiByUscita: Record<string, any[]> = {};
  saving: Record<string, boolean> = {};
  displayedColumns = ['titolo', 'luogo'];
  anagraficaById: Record<string, { nome: string; ruolo: string }> = {};

  constructor(private http: HttpClient, private dataService: DataService) {}

  ngOnInit() {
    this.role = this.dataService.currentUser.role[0];
    this.needsSelect = this.role === 'ResponsabileMusici';
    if (this.needsSelect) {
      this.ruoloOptions = getRuoloOptions(this.role);
      this.loadAnagrafica(() => {
        this.showUscite = true;
      });
    } else {
      this.applyOperativeRole(this.role);
      this.loadUsciteAndAnagrafica();
    }
  }

  onRuoloChange(value: string) {
    this.applyOperativeRole(value);
    this.expandedElement = null;
    this.iscrittiByUscita = {};
    this.loadUsciteAndAnagrafica();
  }

  private applyOperativeRole(role: string) {
    this.operativeRole = role;
    this.ruoloPersoneFilter = getRuoloPersone(role);
  }

  private baseUrl() {
    return window.location.origin;
  }

  private loadAnagrafica(done?: () => void) {
    this.http.get(`${this.baseUrl()}/.netlify/functions/anagrafica-persone`).subscribe({
      next: (res: any) => {
        this.setAnagrafica(res.persone || []);
        done?.();
      },
      error: (err) => {
        alert('ERROR: ' + err.error);
        done?.();
      },
    });
  }

  private loadUsciteAndAnagrafica() {
    this.showUscite = false;
    const uscite$ = this.http.get(`${this.baseUrl()}/.netlify/functions/uscite`);
    if (Object.keys(this.anagraficaById).length > 0) {
      uscite$.subscribe({
        next: (res: any) => {
          this.uscite = res.uscite || [];
          this.showUscite = true;
        },
        error: (err) => {
          alert('ERROR: ' + err.error);
          this.showUscite = true;
        },
      });
      return;
    }
    forkJoin({
      uscite: uscite$,
      anagrafica: this.http.get(`${this.baseUrl()}/.netlify/functions/anagrafica-persone`),
    }).subscribe({
      next: (res: any) => {
        this.uscite = res.uscite?.uscite || [];
        this.setAnagrafica(res.anagrafica?.persone || []);
        this.showUscite = true;
      },
      error: (err) => {
        alert('ERROR: ' + err.error);
        this.showUscite = true;
      },
    });
  }

  private setAnagrafica(persone: { id: string; nome: string; ruolo: string }[]) {
    this.anagraficaById = {};
    persone.forEach((p) => {
      if (p?.id) {
        this.anagraficaById[p.id] = { nome: p.nome || p.id, ruolo: p.ruolo || '' };
      }
    });
  }

  toggleExpand(element: any) {
    if (this.expandedElement === element) {
      this.expandedElement = null;
      return;
    }
    this.expandedElement = element;
    if (!this.iscrittiByUscita[element.id]) {
      this.buildIscritti(element);
    }
  }

  private buildIscritti(element: any) {
    const partecipanti: string[] = element.fields?.Partecipanti || [];
    const convocati = new Set<string>(element.fields?.Convocati || []);
    let iscritti = partecipanti.map((personaId) => {
      const anag = this.anagraficaById[personaId];
      return {
        personaId,
        nome: anag?.nome || personaId,
        ruolo: anag?.ruolo || '',
        convocato: convocati.has(personaId),
        selected: convocati.has(personaId),
      };
    });
    if (this.ruoloPersoneFilter) {
      iscritti = iscritti.filter((i) => i.ruolo === this.ruoloPersoneFilter);
    }
    this.iscrittiByUscita[element.id] = iscritti;
  }

  salva(element: any) {
    const uscitaId = element.id;
    const iscritti = this.iscrittiByUscita[uscitaId] || [];
    const updates = iscritti.map((i: any) => ({
      personaId: i.personaId,
      convocato: !!i.selected,
    }));
    this.saving[uscitaId] = true;
    this.http
      .post(`${this.baseUrl()}/.netlify/functions/convoca`, {
        uscitaId,
        titolo: element.fields?.Titolo || '',
        luogo: element.fields?.Luogo || '',
        updates,
      })
      .subscribe({
        next: (res: any) => {
          alert(res.message || 'Convocazioni salvate');
          iscritti.forEach((i: any) => (i.convocato = !!i.selected));
          const currentIds = new Set(iscritti.map((i: any) => i.personaId));
          const altriConvocati = (element.fields.Convocati || []).filter(
            (id: string) => !currentIds.has(id)
          );
          const selectedIds = iscritti.filter((i: any) => i.selected).map((i: any) => i.personaId);
          element.fields.Convocati = [...altriConvocati, ...selectedIds];
          this.saving[uscitaId] = false;
        },
        error: (err) => {
          alert('ERROR: ' + err.error);
          this.saving[uscitaId] = false;
        },
      });
  }
}
