import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePickerNativeComponent } from './time-picker-native.component';

describe('TimePickerNativeComponent', () => {
  let component: TimePickerNativeComponent;
  let fixture: ComponentFixture<TimePickerNativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimePickerNativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimePickerNativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
