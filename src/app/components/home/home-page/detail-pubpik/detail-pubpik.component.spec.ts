import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPubpikComponent } from './detail-pubpik.component';

describe('DetailPubpikComponent', () => {
  let component: DetailPubpikComponent;
  let fixture: ComponentFixture<DetailPubpikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPubpikComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPubpikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
