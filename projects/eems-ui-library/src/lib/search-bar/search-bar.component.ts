import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, shareReplay, of, isObservable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { InputFieldComponent } from '../input-field/input-field.component';

@Component({
  selector: 'lib-search-bar',
  imports: [CommonModule, InputFieldComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SearchBarComponent,
      multi: true
    }
  ]
})
export class SearchBarComponent implements ControlValueAccessor {
  @Input() placeholder = 'Search…';
  @Input() debounceTime = 300;
  @Input() minLength = 0;
  @Input() suggestions: string[] | Observable<string[]> = [];
  @Input() displayWith: (option: any) => string = (option) => option;
  @Input() suggestionTemplate?: TemplateRef<any>;

  @Output() inputText = new EventEmitter(); // legacy, will emit raw input
  @Output() valueChange = new EventEmitter<string>();
  @Output() optionSelected = new EventEmitter<any>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  isMobile$: Observable<boolean>;

  private inputSubject = new Subject<string>();
  private _value = '';
  disabled = false;

  dropdownOpen = false;
  filteredSuggestions: string[] = [];
  activeIndex: number = -1;
  suggestionsSub?: Subscription;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobile$ = this.breakpointObserver.observe(['(max-width: 600px)'])
      .pipe(
        map(result => result.matches),
        shareReplay(1)
      );
    this.inputSubject.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      filter(val => val.length >= this.minLength)
    ).subscribe(val => {
      this.valueChange.emit(val);
      this.onChange(val);
    });
  }

  get value() {
    return this._value;
  }
  set value(val: string) {
    if (val !== this._value) {
      this._value = val;
      this.inputSubject.next(val);
      this.filterSuggestions(val);
      this.dropdownOpen = !!val && this.filteredSuggestions.length > 0;
      this.activeIndex = -1;
    }
  }

  filterSuggestions(val: string) {
    if (!val || !this.suggestions) {
      this.filteredSuggestions = [];
      return;
    }
    if (isObservable(this.suggestions)) {
      if (this.suggestionsSub) this.suggestionsSub.unsubscribe();
      this.suggestionsSub = this.suggestions.subscribe(list => {
        this.filteredSuggestions = list.filter(opt => this.displayWith(opt).toLowerCase().includes(val.toLowerCase()));
        this.dropdownOpen = this.filteredSuggestions.length > 0;
      });
    } else {
      this.filteredSuggestions = this.suggestions.filter(opt => this.displayWith(opt).toLowerCase().includes(val.toLowerCase()));
      this.dropdownOpen = this.filteredSuggestions.length > 0;
    }
  }

  onInput(val: string) {
    this.inputText.emit(val); // legacy
    this.value = val;
  }

  onFocus() {
    this.focus.emit();
    this.onTouched();
    this.filterSuggestions(this.value);
    this.dropdownOpen = !!this.value && this.filteredSuggestions.length > 0;
  }

  onBlur() {
    setTimeout(() => {
      this.dropdownOpen = false;
      this.blur.emit();
      this.onTouched();
    }, 150); // allow click on dropdown
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.dropdownOpen || !this.filteredSuggestions.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.filteredSuggestions.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + this.filteredSuggestions.length) % this.filteredSuggestions.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.activeIndex >= 0 && this.activeIndex < this.filteredSuggestions.length) {
        this.selectOption(this.filteredSuggestions[this.activeIndex]);
      }
    } else if (event.key === 'Escape') {
      this.dropdownOpen = false;
    }
  }

  selectOption(option: any) {
    this.value = this.displayWith(option);
    this.optionSelected.emit(option);
    this.dropdownOpen = false;
  }

  clearInput(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.value = '';
    this.filteredSuggestions = [];
    this.dropdownOpen = false;
  }

  ngOnDestroy() {
    if (this.suggestionsSub) this.suggestionsSub.unsubscribe();
  }

  // ControlValueAccessor
  writeValue(val: string): void {
    this._value = val || '';
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
}
