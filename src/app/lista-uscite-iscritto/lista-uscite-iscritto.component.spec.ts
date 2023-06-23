import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUsciteIscrittoComponent } from './lista-uscite-iscritto.component';

describe('ListaUsciteIscrittoComponent', () => {
  let component: ListaUsciteIscrittoComponent;
  let fixture: ComponentFixture<ListaUsciteIscrittoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaUsciteIscrittoComponent]
    });
    fixture = TestBed.createComponent(ListaUsciteIscrittoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
