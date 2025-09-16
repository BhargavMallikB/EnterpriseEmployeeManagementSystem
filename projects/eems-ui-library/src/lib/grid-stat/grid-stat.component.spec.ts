import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridStatComponent } from './grid-stat.component';

describe('GridStatComponent', () => {
  let component: GridStatComponent;
  let fixture: ComponentFixture<GridStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridStatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
