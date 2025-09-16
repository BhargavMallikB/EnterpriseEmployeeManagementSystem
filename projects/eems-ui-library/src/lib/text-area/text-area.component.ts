import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-text-area',
  imports: [CommonModule, FormsModule],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true
    }
  ]
})
export class TextAreaComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  @Input() label = ''; 
  @Input() placeholder = '';
  @Input() info = '';
  @Input() required = false;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() maxLength: number | null = null;
  @Input() rows = 4;
  @Input() cols: number | null = null;
  @Input() clearable = false;
  @Input() error = '';
  @Input() value = '';
  @Input() autofocus = false;

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('textareaRef', { static: true }) textareaRef!: ElementRef<HTMLTextAreaElement>;

  dirty = false;
  touched = false;
  invalid = false;

  onChange: (v: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && !changes['value'].firstChange) {
      this.value = changes['value'].currentValue;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.textareaRef.nativeElement.focus();
      this.cdr.detectChanges();
    }, 0);
  }

  writeValue(val: any): void {
    this.value = val ?? '';
    this.updateValidation();
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  onInput(val: string): void {
    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val);
    this.dirty = true;
    this.updateValidation();
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
    this.updateValidation();
  }

  clearTextarea(): void {
    this.value = '';
    this.onChange('');
    this.valueChange.emit('');
    if (this.textareaRef) {
      this.textareaRef.nativeElement.focus();
    }
    this.updateValidation();
  }

  get showError(): boolean {
    return this.required && this.touched && !this.value;
  }

  get errorMessage(): string {
    if (this.required && !this.value) return 'This field is required.';
    if (this.error) return this.error;
    return '';
  }

  get isClearable(): boolean {
    return this.clearable && !!this.value && !this.disabled && !this.readonly;
  }

  updateValidation(): void {
    this.invalid = this.showError;
  }
}
