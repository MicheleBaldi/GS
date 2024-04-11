import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezionaPersonaComponent } from './seleziona-persona.component';

describe('SelezionaPersonaComponent', () => {
  let component: SelezionaPersonaComponent;
  let fixture: ComponentFixture<SelezionaPersonaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelezionaPersonaComponent]
    });
    fixture = TestBed.createComponent(SelezionaPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
