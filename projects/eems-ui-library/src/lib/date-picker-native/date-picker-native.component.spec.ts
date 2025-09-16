import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerNativeComponent } from './date-picker-native.component';

describe('DatePickerNativeComponent', () => {
  let component: DatePickerNativeComponent;
  let fixture: ComponentFixture<DatePickerNativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerNativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerNativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
