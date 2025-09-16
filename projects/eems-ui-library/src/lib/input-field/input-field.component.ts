import {Component, Output, EventEmitter, forwardRef, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, computed, signal, effect, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-input-field',
  imports: [CommonModule, FormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements ControlValueAccessor, AfterViewInit {
  @Input() showErrorOnSubmit: boolean = false;
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() infoIcon: string = '';
  @Input() infoTooltip: string = '';
  @Input() required: boolean = false;
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() prefixImage: string = '';
  @Input() suffixImage: string = '';
  @Input() clearable: boolean = false;
  @Input() error: string = '';
  @Input() success: string = '';
  @Input() showClear: boolean = false;
  @Input() type: 'text' | 'email' | 'number' | 'password' | 'date' = 'text';
  @Input() maxLength: number | null = null;
  @Input() companyDomain: string = '';
  @Input() autocapitalize: 'on' | 'off' | 'words' | 'sentences' | 'characters' = 'off';
  @Input() autofocus: boolean = true; // default true for backward compatibility
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() numericWithComma: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('inputRef', { static: true }) inputRef!: ElementRef<HTMLInputElement>;

  // Regular signals for mutable state
  dirty = signal(false);
  touched = signal(false);
  invalid = signal(false);
  displayValue = signal<string>('');
  internalValue = signal<string>('');

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
    private cdr: ChangeDetectorRef,
    public hostElement?: ElementRef
  ) {
     // Sync external [value] changes into internalValue
  effect(() => {
    const incoming = this.value;
    // Only update if different, to avoid loops
    if (incoming !== undefined && incoming !== this.internalValue()) {
      this.writeValue(incoming);
    }
  });
  }

  // Computed signals
  // showError = computed(() => {
  //   const required = this.required;
  //   const touched = this.touched();
  //   const value = this.internalValue();
  //   const type = this.type;
  //   const companyDomain = this.companyDomain;
  //   const showOnSubmit = this.showErrorOnSubmit;

  //   if (required && (touched || showOnSubmit) && !value) return true;
  //   if (type === 'email' && value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return true;
  //   if (type === 'email' && companyDomain && value && !value.endsWith(companyDomain)) return true;
  //   if (type === 'email' && companyDomain === '@gmail.com' && value && !/^[a-zA-Z0-9]+@gmail\.com$/.test(value)) return true;
  //   return false;
  // });
  // 🚩 Fixed logic: only show error when touched/dirty or submitted
  // 🚩 Fixed logic: only show error when touched/dirty or submitted
showError = computed(() => {
const required = this.required;
const touched = this.touched();
const dirty = this.dirty();
const value = this.internalValue();
const type = this.type;
const companyDomain = this.companyDomain;
const showOnSubmit = this.showErrorOnSubmit;

// STRICT: Only show errors when form is submitted OR when user has interacted AND field has value issues
if (showOnSubmit) {
  // Form was submitted - show all validation errors
  if (required && !value) return true;
  if (type === 'email' && value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return true;
  if (type === 'email' && companyDomain && value && !value.endsWith(companyDomain)) return true;
  if (type === 'email' && companyDomain === '@gmail.com' && value && !/^[a-zA-Z0-9]+@gmail\.com$/.test(value)) return true;
} else if ((touched || dirty) && value) {
  // User has interacted and entered some value - only show format errors, not required errors
  if (type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return true;
  if (type === 'email' && companyDomain && !value.endsWith(companyDomain)) return true;
  if (type === 'email' && companyDomain === '@gmail.com' && !/^[a-zA-Z0-9]+@gmail\.com$/.test(value)) return true;
}

return false;
});

  errorMessage = computed(() => {
    const required = this.required;
    const value = this.internalValue();
    const type = this.type;
    const companyDomain = this.companyDomain;

    if (required && !value) return 'This field is required.';
    if (type === 'email' && value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return 'Enter a valid email address.';
    if (type === 'email' && companyDomain && value && !value.endsWith(companyDomain)) return `Email must end with ${companyDomain}`;
    if (type === 'email' && companyDomain === '@gmail.com' && value && !/^[a-zA-Z0-9]+@gmail\.com$/.test(value)) return 'Only Gmail addresses (letters and numbers) are allowed.';
    return '';
  });

  isClearable = computed(() => {
    return this.clearable && !!this.internalValue() && !this.disabled && !this.readonly;
  });

  writeValue(val: any): void {
    const newValue = val || '';
    this.internalValue.set(newValue);
    const displayVal = this.numericWithComma && newValue !== ''
      ? this.formatWithCommas(newValue)
      : newValue;
    this.displayValue.set(displayVal);
    // Don't run validation on initial value setting
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { 
    // Note: We can't modify input signals, so we'll handle this in the template
  }

  onInput(eventOrValue: Event | string) {
    let val: string = typeof eventOrValue === 'string'
      ? eventOrValue
      : (eventOrValue.target as HTMLInputElement).value;

  if (this.numericWithComma) {
      const raw = val.replace(/,/g, '');
      if (!/^[0-9]*$/.test(raw)) return;
      this.internalValue.set(raw);
      this.displayValue.set(this.formatWithCommas(raw));
  } else if (this.type === 'number' && this.companyDomain === 'comma') {
      val = val.replace(/,/g, '');
      if (!/^[0-9]*$/.test(val)) return;
      const formattedValue = Number(val).toLocaleString('en-US');
      this.internalValue.set(formattedValue);
      this.displayValue.set(formattedValue);
    } else {
      this.internalValue.set(val);
      this.displayValue.set(val);
    }

    this.onChange(this.internalValue());
    this.valueChange.emit(this.internalValue());
    this.dirty.set(true);
    this.updateValidation();
  }

  onBlur() {
    this.touched.set(true);
    this.onTouched();
    this.updateValidation();
  }

  clearInput() {
    this.internalValue.set('');
    this.displayValue.set('');
    this.dirty.set(false);
    this.touched.set(false);
    this.onChange('');
    this.valueChange.emit('');
    this.inputRef.nativeElement.focus();
    this.updateValidation();
  }

  updateValidation() {
    this.invalid.set(this.showError());
  }

  formatWithCommas(val: string | number): string {
    if (val === null || val === undefined || val === '') return '';
    return Number(val).toLocaleString('en-US');
  }

  ngOnInit() {
    // Initialize display value without triggering validation
    const initialValue = this.internalValue();
    const displayVal = this.numericWithComma && initialValue !== ''
      ? this.formatWithCommas(initialValue)
      : initialValue;
    this.displayValue.set(displayVal);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
  if (this.autofocus) {
        this.inputRef.nativeElement.focus();
      }
      this.cdr.detectChanges();
    }, 0);

    const nativeInput = this.inputRef.nativeElement;
    const host = this.hostElement?.nativeElement || nativeInput.parentElement;
    const events = ['input', 'focus', 'blur', 'change', 'keydown', 'keyup'];
    events.forEach(eventName => {
      nativeInput.addEventListener(eventName, (event: Event) => {
        host?.dispatchEvent(new Event(eventName, event));
      });
    });
  }
}
