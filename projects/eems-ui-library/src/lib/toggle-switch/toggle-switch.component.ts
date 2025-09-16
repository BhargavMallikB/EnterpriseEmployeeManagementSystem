import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-toggle-switch',
  imports: [CommonModule],
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.scss'
})
export class ToggleSwitchComponent {
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Input() onLabel: string = 'On';
  @Input() offLabel: string = 'Off';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: string = '#0d6efd';

  @Output() toggled = new EventEmitter<boolean>();

  onToggle() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.toggled.emit(this.checked);
    }
  }
}
