import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessRegisterComponent } from './process-register.component';

describe('ProcessRegisterComponent', () => {
  let component: ProcessRegisterComponent;
  let fixture: ComponentFixture<ProcessRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
