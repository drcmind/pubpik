import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPubPikComponent } from './add-pub-pik.component';

describe('AddPubPikComponent', () => {
  let component: AddPubPikComponent;
  let fixture: ComponentFixture<AddPubPikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPubPikComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPubPikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
