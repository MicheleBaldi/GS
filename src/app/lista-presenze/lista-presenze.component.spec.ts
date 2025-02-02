import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPresenzeComponent } from './lista-presenze.component';

describe('ListaPresenzeComponent', () => {
  let component: ListaPresenzeComponent;
  let fixture: ComponentFixture<ListaPresenzeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaPresenzeComponent]
    });
    fixture = TestBed.createComponent(ListaPresenzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
