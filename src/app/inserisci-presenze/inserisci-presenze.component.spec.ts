import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserisciPresenzeComponent } from './inserisci-presenze.component';

describe('InserisciPresenzeComponent', () => {
  let component: InserisciPresenzeComponent;
  let fixture: ComponentFixture<InserisciPresenzeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InserisciPresenzeComponent]
    });
    fixture = TestBed.createComponent(InserisciPresenzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
