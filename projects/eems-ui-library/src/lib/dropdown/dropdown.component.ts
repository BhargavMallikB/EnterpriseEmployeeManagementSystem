import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  ElementRef,
  HostListener,
  forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { InputFieldComponent } from '../input-field/input-field.component';
export type DropdownOption = string | { label: string; value: string };


@Component({
  selector: 'lib-dropdown',
  imports: [CommonModule, LayoutModule, FormsModule,ButtonComponent,InputFieldComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Select';
  @Input() label: string = '';
  @Input() size: 'tiny' | 'small' | 'medium' | 'large' = 'medium';
  @Input() info: string = '';
  @Input() searchable: boolean = false;
  @Input() multiselect: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  
  /**
   * Custom width for the dropdown (e.g. '200px', '50%', etc.)
   */
  @Input() customWidth: string | null = null;
  /**
   * Custom font size for the dropdown (e.g. '18px', '1.2rem', etc.)
   */
  @Input() customFontSize: string | null = null;
  /**
   * Custom height for the dropdown (e.g. '40px', '2.5rem', etc.)
   */
  @Input() customHeight: string | null = null;

  @Output() selectionChange = new EventEmitter<string | string[]>();

  searchTerm: string = '';
  selectedOptions: DropdownOption[] = [];
  value: string | string[] = '';

  selectedOption = signal<DropdownOption | null>(null);
  isOpen = signal(false);
  isMobile = signal(false);

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  get customStyle() {
    const style: {[key: string]: string} = {};
    if (this.customWidth) {
      style['--dropdown-width'] = this.customWidth;
      style['width'] = this.customWidth;
    }
    if (this.customFontSize) {
      style['--dropdown-font-size'] = this.customFontSize;
      style['font-size'] = this.customFontSize;
    }
    if (this.customHeight) {
      style['--dropdown-height'] = this.customHeight;
      style['height'] = this.customHeight;
      style['min-height'] = this.customHeight;
    }
    return style;
  }

  constructor(private bp: BreakpointObserver, private elRef: ElementRef) {
    this.bp.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile.set(result.matches);
    });
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = value;
    if (value) {
      if (this.multiselect) {
        this.selectedOptions = this.options.filter(opt => 
          (Array.isArray(value) ? value : [value]).includes(this.getOptionValue(opt))
        );
      } else {
        const option = this.options.find(opt => this.getOptionValue(opt) === value);
        this.selectedOption.set(option || null);
      }
    } else {
      this.selectedOptions = [];
      this.selectedOption.set(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

 
  toggleDropdown(): void {
    if (this.disabled || this.readonly) return;
    const willOpen = !this.isOpen();
    this.isOpen.set(willOpen);
    if (willOpen) {
      this.searchTerm = '';
    }
  }

  selectOption(option: DropdownOption, event: MouseEvent): void {
    if (this.disabled || this.readonly) return;
    event.stopPropagation();

    this.onTouched(); // Mark as touched

    if (this.multiselect) {
      const index = this.selectedOptions.findIndex(
        opt => this.getOptionValue(opt) === this.getOptionValue(option)
      );

      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      } else {
        this.selectedOptions.push(option);
      }

      const values = this.selectedOptions.map(opt => this.getOptionValue(opt));
      this.value = values;
      this.onChange(values);
      this.selectionChange.emit(values);
    } else {
      this.selectedOption.set(option);
      const value = this.getOptionValue(option);
      this.value = value;
      this.onChange(value);
      this.selectionChange.emit(value);
      this.isOpen.set(false);
    }
  }

  resetSearch(event: Event): void {
    event.stopPropagation();
    this.searchTerm = '';
    // Focus back to search input after clearing
    setTimeout(() => {
      const searchInput = this.elRef.nativeElement.querySelector('.dropdown-search input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 0);
  }

  onSearchFocus(): void {
    // Ensure dropdown stays open when search input is focused
    this.isOpen.set(true);
  }

  get filteredOptions(): DropdownOption[] {
    const term = this.searchTerm.toLowerCase();
    return term
      ? this.options.filter(opt => this.getOptionLabel(opt).toLowerCase().includes(term))
      : this.options;
  }

  getOptionLabel(option: DropdownOption): string {
    return typeof option === 'string' ? option : option.label;
  }

  getOptionValue(option: DropdownOption): string {
    return typeof option === 'string' ? option : (option.value || option.label);
  }

  isOptionSelected(option: DropdownOption): boolean {
    return this.selectedOptions.some(opt => this.getOptionValue(opt) === this.getOptionValue(option));
  }

  getSelectedCount(): number {
    return this.selectedOptions.length;
  }
}
