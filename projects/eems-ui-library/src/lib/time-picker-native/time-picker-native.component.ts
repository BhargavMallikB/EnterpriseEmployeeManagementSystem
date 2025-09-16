import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  HostListener,
  inject,
  input,
  output,
  signal,
  computed,
  effect,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ButtonComponent } from '../button/button.component';
import { InputFieldComponent } from '../input-field/input-field.component';


@Component({
  selector: 'lib-time-picker-native',
  imports: [CommonModule, FormsModule, ButtonComponent, InputFieldComponent],
  templateUrl: './time-picker-native.component.html',
  styleUrl: './time-picker-native.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerNativeComponent),
      multi: true
    }
  ]
})
export class TimePickerNativeComponent implements ControlValueAccessor {
  // Inputs
  format = input<'12' | '24'>('24');
  // Internal writable signal for format toggle
  internalFormat = signal<'12' | '24'>(this.format());
  minuteStep = input<number>(1);
  minTime = input<string | Date | undefined>(undefined);
  maxTime = input<string | Date | undefined>(undefined);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  label = input<string>('');
  required = input<boolean>(false);
  error = input<string>('');
  outputAs = input<'string' | 'date'>('string');
  size = input<'small' | 'medium' | 'large'>('medium');

  // Outputs
  valueChange = output<string | Date | null>();

  // Internal signals
  value = signal<string | Date | null>(null);
  isDropdownOpen = signal(false);
  hours = signal<number[]>([]);
  minutes = signal<number[]>([]);
  selectedHour = signal<number>(0);
  selectedMinute = signal<number>(0);
  ampm = signal<'AM' | 'PM'>('AM');
  private _validationError = signal('');

  onChange: any = () => {};
  onTouched: any = () => {};

  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.generateTimeOptions();
    effect(() => {
      if (this.value() == null) {
        this.setValue(this.getNowString());
      }
    });
    // Keep internalFormat in sync with input format
    effect(() => {
      this.internalFormat.set(this.format());
    });
    effect(() => {
      this.generateTimeOptions();
    }, { allowSignalWrites: true });
  }

  // Method to toggle format from the UI
  toggleFormat() {
    const next = this.internalFormat() === '12' ? '24' : '12';
    this.internalFormat.set(next);
    this.generateTimeOptions();
    // Optionally, emit an event to parent if you want to sync
  }

  writeValue(val: string | Date | null): void {
    if (val == null || val === '') {
      val = this.getNowString();
    }
    this.value.set(val);
    this.syncFromValue();
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    // disabled is input() so we can't set it directly here without a writable signal.
    // If you need setDisabledState to work, create a writable signal and mirror the input into it.
    console.warn('Disabled state change requested:', isDisabled);
  }

  generateTimeOptions() {
    const format = this.internalFormat();
    const minuteStep = this.minuteStep();
    this.hours.set(format === '12' ? Array.from({length: 12}, (_, i) => i + 1) : Array.from({length: 24}, (_, i) => i));
    this.minutes.set(Array.from({length: 60 / minuteStep}, (_, i) => i * minuteStep));
  }

  onHourChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const hour = parseInt(target.value, 10);
    this.selectedHour.set(hour);
  }

  onMinuteChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const minute = parseInt(target.value, 10);
    this.selectedMinute.set(minute);
  }

  onAmpmChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.ampm.set(target.value as 'AM' | 'PM');
  }

  // ngOnChanges logic replaced by effects in constructor

  onInputChange(val: string) {
    let cleanVal = val.replace(/[^0-9:]/g, '');
    if (cleanVal.length > 5) cleanVal = cleanVal.slice(0, 5);
    if (cleanVal && this.isValidTimeFormat(cleanVal)) {
      const validationError = this.validateTime(cleanVal);
      if (validationError) {
        this._validationError.set(validationError);
        return;
      }
    }
    this._validationError.set('');
    this.setValue(cleanVal);
  }

  setValue(val: string | Date | null) {
    this.value.set(val);
    this.valueChange.emit(this.getOutputValue());
    this.onChange(this.getOutputValue());
    this.onTouched();
    this.syncFromValue();
    if (val && typeof val === 'string') {
      const validationError = this.validateTime(val);
      if (!validationError) {
        this._validationError.set('');
      }
    }
  }

  getOutputValue(): string | Date | null {
    const value = this.value();
    if (!value) return null;
    if (this.outputAs() === 'date') {
      if (typeof value === 'string') {
        const [h, m] = value.split(':');
        const d = new Date();
        d.setHours(Number(h), Number(m), 0, 0);
        return d;
      }
      return value;
    }
    if (typeof value === 'string') return value;
    return value instanceof Date ? value.toTimeString().slice(0,5) : null;
  }

  displayValue = computed(() => {
    const value = this.value();
    if (!value) return '';
    let h: number, m: number;
    if (typeof value === 'string') {
      [h, m] = value.split(':').map(Number);
    } else if (value instanceof Date) {
      h = value.getHours();
      m = value.getMinutes();
    } else {
      return '';
    }
    if (this.internalFormat() === '12') {
      const displayHour = ((h % 12) === 0 ? 12 : h % 12);
      return `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  });

  minTimeString = computed(() => {
    const minTime = this.minTime();
    if (!minTime) return null;
    if (minTime instanceof Date) {
      return (
        minTime.getHours().toString().padStart(2, '0') +
        ':' +
        minTime.getMinutes().toString().padStart(2, '0')
      );
    }
    return minTime;
  });

  maxTimeString = computed(() => {
    const maxTime = this.maxTime();
    if (!maxTime) return null;
    if (maxTime instanceof Date) {
      return (
        maxTime.getHours().toString().padStart(2, '0') +
        ':' +
        maxTime.getMinutes().toString().padStart(2, '0')
      );
    }
    return maxTime;
  });

  combinedError = computed(() => {
    return this._validationError() || this.error();
  });

  syncFromValue() {
    let h = 0, m = 0;
    const value = this.value();
    if (typeof value === 'string' && value) {
      const [hs, ms] = value.split(':');
      h = Number(hs);
      m = Number(ms);
    } else if (value instanceof Date) {
      h = value.getHours();
      m = value.getMinutes();
    }
    if (this.internalFormat() === '12') {
      this.selectedHour.set(((h % 12) === 0 ? 12 : h % 12));
      this.ampm.set(h >= 12 ? 'PM' : 'AM');
    } else {
      this.selectedHour.set(h);
    }
    this.selectedMinute.set(m);
  }

  onDropdownSelect(hour: number, minute: number, ampm?: 'AM' | 'PM') {
    let h = hour;
    if (this.internalFormat() === '12' && ampm) {
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
    }
    const val = `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const validationError = this.validateTime(val);
    if (validationError) {
      this._validationError.set(validationError);
      return;
    }
    this._validationError.set('');
    this.setValue(val);
    this.isDropdownOpen.set(false);
  }


  onFocus() {
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isDropdownOpen()) {
      const target = event.target as HTMLElement;
      if (!target.closest('.time-picker-native-wrapper')) {
        this.isDropdownOpen.set(false);
      }
    }
  }

  private getNowString(): string {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    if (this.format() === '12') {
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  isTimeDisabled(hour: number, minute: number, ampm?: 'AM' | 'PM'): boolean {
    let h = hour;
    if (this.internalFormat() === '12' && ampm) {
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
    }
    const candidate = `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const minTime = this.minTime();
    const maxTime = this.maxTime();
    const min = minTime ? (typeof minTime === 'string' ? minTime : `${minTime.getHours().toString().padStart(2, '0')}:${minTime.getMinutes().toString().padStart(2, '0')}`) : null;
    const max = maxTime ? (typeof maxTime === 'string' ? maxTime : `${maxTime.getHours().toString().padStart(2, '0')}:${maxTime.getMinutes().toString().padStart(2, '0')}`) : null;
    if (min && candidate < min) return true;
    if (max && candidate > max) return true;
    return false;
  }

  isHourDisabled(hour: number): boolean {
    const minutes = this.minutes();
    if (this.internalFormat() === '12') {
      const amDisabled = minutes.every(minute => this.isTimeDisabled(hour, minute, 'AM'));
      const pmDisabled = minutes.every(minute => this.isTimeDisabled(hour, minute, 'PM'));
      return amDisabled && pmDisabled;
    } else {
      return minutes.every(minute => this.isTimeDisabled(hour, minute));
    }
  }

  isMinuteDisabled(minute: number): boolean {
    const selectedHour = this.selectedHour();
    if (this.internalFormat() === '12') {
      const amDisabled = this.isTimeDisabled(selectedHour, minute, 'AM');
      const pmDisabled = this.isTimeDisabled(selectedHour, minute, 'PM');
      return amDisabled && pmDisabled;
    } else {
      return this.isTimeDisabled(selectedHour, minute);
    }
  }

  isAmpmDisabled(ampm: 'AM' | 'PM'): boolean {
    const selectedHour = this.selectedHour();
    const minutes = this.minutes();
    return minutes.every(minute => this.isTimeDisabled(selectedHour, minute, ampm));
  }

  isValidTimeFormat(timeString: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  }

  validateTime(timeString: string): string | null {
    if (!this.isValidTimeFormat(timeString)) {
      return 'Please enter a valid time format (HH:MM)';
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    if (hours < 0 || hours > 23) {
      return 'Hours must be between 0 and 23';
    }
    if (minutes < 0 || minutes > 59) {
      return 'Minutes must be between 0 and 59';
    }
    const minTimeString = this.minTimeString();
    if (minTimeString && timeString < minTimeString) {
      return `Time must be after ${minTimeString}`;
    }
    const maxTimeString = this.maxTimeString();
    if (maxTimeString && timeString > maxTimeString) {
      return `Time must be before ${maxTimeString}`;
    }
    return null;
  }
}
