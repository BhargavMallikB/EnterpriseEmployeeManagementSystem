import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'plain' | 'custom' | 'link' | 'icon' = 'primary';
  @Input() disabled: boolean = false;
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() loading: boolean = false;
  @Input() fab: boolean = false;
  @Input() plain: boolean = false;
  @Input() nonClickable: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() preset: 'main' | 'submit' | 'cancel' | 'disabled' | null = null;
  @Input() suppressAlert: boolean = false;

  @Output() clicked = new EventEmitter<Event>();


  // Getter for display label
  get displayLabel(): string {
    if (this.preset) {
      switch (this.preset) {
        case 'main': return 'Main';
        case 'submit': return 'Submit';
        case 'cancel': return 'Cancel';
        case 'disabled': return 'Disabled';
      }
    }
    return this.label;
  }

  onClick(event: Event) {
    if (this.disabled || this.loading || this.nonClickable) return;
    this.clicked.emit(event);
    // if (!this.suppressAlert) {
    //   alert("button is working");
    // }
  }
}
