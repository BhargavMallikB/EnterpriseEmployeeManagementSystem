import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'lib-radio',
  imports: [CommonModule],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss'
})
export class RadioComponent implements OnInit {
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() selectedValue: string = '';
  @Input() disabledOptions: string[] = [];
  @Input() layout: 'horizontal' | 'vertical' = 'vertical';

  @Output() selectedValueChange = new EventEmitter<string>();
    // New Optional Inputs
  @Input() groupClass: string = '';
  @Input() labelClass: string = '';
  @Input() optionClass: string = '';
  @Input() accentColor: string = '#0d6efd'; // Default blue
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
 ngOnInit() {
    // Emit the default selected value on load if it's valid
    if (this.selectedValue && this.options.includes(this.selectedValue)) {
      this.selectedValueChange.emit(this.selectedValue);
    }
  }
  isDisabled(option: string): boolean {
    return this.disabledOptions.includes(option);
  }

  onSelectionChange(option: string): void {
    if (!this.isDisabled(option)) {
      this.selectedValue = option;
      this.selectedValueChange.emit(this.selectedValue);
    }
  }
}
