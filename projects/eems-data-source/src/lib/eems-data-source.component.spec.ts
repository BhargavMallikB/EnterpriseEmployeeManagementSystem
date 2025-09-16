import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EemsDataSourceComponent } from './eems-data-source.component';

describe('EemsDataSourceComponent', () => {
  let component: EemsDataSourceComponent;
  let fixture: ComponentFixture<EemsDataSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EemsDataSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EemsDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
