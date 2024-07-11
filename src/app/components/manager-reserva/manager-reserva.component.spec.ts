import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReservaComponent } from './manager-reserva.component';

describe('ManagerReservaComponent', () => {
  let component: ManagerReservaComponent;
  let fixture: ComponentFixture<ManagerReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerReservaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
