import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUsciteComponent } from './lista-uscite.component';

describe('ListaUsciteComponent', () => {
  let component: ListaUsciteComponent;
  let fixture: ComponentFixture<ListaUsciteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaUsciteComponent]
    });
    fixture = TestBed.createComponent(ListaUsciteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
