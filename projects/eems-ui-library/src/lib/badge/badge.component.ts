import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-badge',
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input() value: string | number = '';

  @Input() color:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark' = 'primary';

  @Input() variant: 'solid' | 'soft' | 'outline' = 'solid';

  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Input() position:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'inline' = 'inline';

  @Input() rounded = true;
  @Input() isDot = false;
}
