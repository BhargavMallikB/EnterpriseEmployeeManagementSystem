import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  inject,
  signal,
  computed,
  effect,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { InputFieldComponent } from '../input-field/input-field.component';
import { ButtonComponent } from '../button/button.component';


export interface MarkedDate {
  date: string | Date;
  color: string;
  description?: string;
}

@Component({
  selector: 'lib-date-picker-native',
  imports: [CommonModule, FormsModule, InputFieldComponent, ButtonComponent],
  templateUrl: './date-picker-native.component.html',
  styleUrl: './date-picker-native.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerNativeComponent),
      multi: true,
    },
  ],
})
export class DatePickerNativeComponent implements ControlValueAccessor {
  @Input() minDate?: string | Date;
  @Input() maxDate?: string | Date;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() outputAs: 'string' | 'date' = 'string';
  @Input() clearable: boolean = true;
  @Input() defaultDate: Date | null = null;
  @Input() locale: string = 'en-US';
  @Input() weekStart: 0 | 1 = 0;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() markedDates: MarkedDate[] = [];
  @Input() calendarBackground?: string;

  @Output() valueChange = new EventEmitter<string | Date | null>();
  @Output() dateChange = new EventEmitter<Date>();

  // Internal writable signals
  value = signal<string | Date | null>(null);
  isMobile = signal(false);
  calendarOpen = signal(false);
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  weeks = signal<
    Array<
      Array<{
        date: Date;
        label: string;
        isToday: boolean;
        isSelected: boolean;
        isDisabled: boolean;
      }>
    >
  >([]);
  weekDays = signal<string[]>([]);

  months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  private breakpointObserver = inject(BreakpointObserver);
  private elementRef = inject(ElementRef);

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    // Responsive detection
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe(result => this.isMobile.set(result.matches));

    // Init calendar once
    this.initCalendar();

    // React to defaultDate changes if no value
    effect(() => {
      if ((this.value() == null || this.value() === '') && this.defaultDate) {
        this.setValue(this.defaultDate);
      }
    });
  }

  // Host click handler to close calendar when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
  if (this.calendarOpen() && !this.disabled) {
      const clickedElement = event.target as HTMLElement;
      const isClickInside = this.elementRef.nativeElement.contains(clickedElement);
      if (!isClickInside) {
        this.calendarOpen.set(false);
      }
    }
  }

  // Computed properties
  minDateString = computed(() => {
  const md = this.minDate;
    if (!md) return null;
    return md instanceof Date ? md.toISOString().slice(0, 10) : md;
  });

  maxDateString = computed(() => {
  const md = this.maxDate;
    if (!md) return null;
    return md instanceof Date ? md.toISOString().slice(0, 10) : md;
  });

  displayValue = computed(() => {
    const val = this.value();
    if (!val) return '';
    let date: Date;
    if (typeof val === 'string') {
      date = new Date(val);
      if (isNaN(date.getTime())) return '';
    } else {
      date = val;
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  getMarkedStyle(date: Date) {
  const md = this.markedDates;
    if (!md?.length) return null;
    const dStr = this.formatDate(date);
    const marked = md.find(m => this.formatDate(m.date) === dStr);
    return marked ? { background: marked.color, color: '#fff' } : null;
  }

  getMarkedDescription(date: Date) {
  const md = this.markedDates;
    if (!md?.length) return null;
    const dStr = this.formatDate(date);
    const marked = md.find(m => this.formatDate(m.date) === dStr);
    return marked?.description || null;
  }

  getCalendarBackgroundStyle() {
  const bg = this.calendarBackground;
    if (!bg) return null;
    if (bg.startsWith('url(') || bg.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
      return { background: `url(${bg.replace(/^url\((.*)\)$/, '$1')}) center/cover no-repeat` };
    }
    return { background: bg };
  }

  initCalendar() {
    const baseDate = new Date(2020, 5, 7); // Sunday
    this.weekDays.set(
      Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(baseDate);
  d.setDate(baseDate.getDate() + ((i + this.weekStart) % 7));
  return d.toLocaleDateString(this.locale, { weekday: 'short' });
      })
    );
    this.generateCalendar();
  }

  generateCalendar() {
  const firstDayOfMonth = new Date(this.currentYear(), this.currentMonth(), 1);
  const lastDayOfMonth = new Date(this.currentYear(), this.currentMonth() + 1, 0);
  const firstDayOfWeek = (firstDayOfMonth.getDay() - this.weekStart + 7) % 7;
    const daysInMonth = lastDayOfMonth.getDate();
    const today = new Date();
    const selectedDate = this.value() instanceof Date ? this.value() : null;

    let days: Array<any> = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        date: new Date(this.currentYear(), this.currentMonth(), i - firstDayOfWeek + 1),
        label: '',
        isToday: false,
        isSelected: false,
        isDisabled: true
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(this.currentYear(), this.currentMonth(), d);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = !!(
        selectedDate &&
        selectedDate instanceof Date &&
        date.toDateString() === selectedDate.toDateString()
      );
      const isDisabled = !!(
  (this.minDate && date < new Date(this.minDate)) ||
  (this.maxDate && date > new Date(this.maxDate))
      );
      days.push({ date, label: d.toString(), isToday, isSelected, isDisabled });
    }

    while (days.length % 7 !== 0) {
      days.push({
        date: new Date(this.currentYear(), this.currentMonth(), daysInMonth + (days.length - firstDayOfWeek) + 1),
        label: '',
        isToday: false,
        isSelected: false,
        isDisabled: true
      });
    }

    const weeksArr: any[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArr.push(days.slice(i, i + 7));
    }
    this.weeks.set(weeksArr);
  }

  prevMonth() {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update(y => y - 1);
    } else {
      this.currentMonth.update(m => m - 1);
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update(y => y + 1);
    } else {
      this.currentMonth.update(m => m + 1);
    }
    this.generateCalendar();
  }

  selectDate(day: { date: Date; isDisabled: boolean }) {
    if (day.isDisabled) return;
    this.setValue(day.date);
    this.dateChange.emit(day.date);
    this.calendarOpen.set(false);
    this.generateCalendar();
  }

  goToToday() {
    const today = new Date();
    this.currentMonth.set(today.getMonth());
    this.currentYear.set(today.getFullYear());
    this.setValue(today);
    this.dateChange.emit(today);
    this.calendarOpen.set(false);
    this.generateCalendar();
  }

  setValue(val: string | Date | null) {
    this.value.set(val);
    this.valueChange.emit(this.getOutputValue());
    this.onChange(this.getOutputValue());
    this.onTouched();
  }

  getOutputValue(): string | Date | null {
    const val = this.value();
    if (!val) return null;
  if (this.outputAs === 'date') {
      if (typeof val === 'string') return new Date(val);
      return val;
    }
    if (typeof val === 'string') return val;
    return val instanceof Date ? val.toISOString().slice(0, 10) : null;
  }

  // small helpers added for the template (ngModelChange, toggle)
  toggleCalendar() {
  if (this.disabled) return;
    this.calendarOpen.set(!this.calendarOpen());
  }

  onMonthChange(monthIndex: number) {
    // ngModel emits string for option value sometimes; ensure number
    const m = typeof monthIndex === 'string' ? parseInt(monthIndex, 10) : monthIndex;
    this.currentMonth.set(Number.isNaN(m) ? 0 : m);
    this.generateCalendar();
  }

  onYearChange(yearValue: number | string) {
    const y = typeof yearValue === 'string' ? parseInt(yearValue, 10) : yearValue;
    this.currentYear.set(Number.isNaN(y) ? new Date().getFullYear() : y);
    this.generateCalendar();
  }

  clear() {
    this.setValue(null);
  }

  formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ControlValueAccessor
  writeValue(val: string | Date | null): void {
    if ((val == null || val === '') && this.defaultDate) {
      val = this.defaultDate;
    }
    this.value.set(val);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    // disabled is input() so we can't set it directly here without a writable signal.
    // If you need setDisabledState to work, create a writable signal and mirror the input into it.
    console.warn('Disabled state change requested:', isDisabled);
  }
}
