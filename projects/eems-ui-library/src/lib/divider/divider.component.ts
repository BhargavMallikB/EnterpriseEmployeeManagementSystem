import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-divider',
  imports: [CommonModule],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss'
})
export class DividerComponent {
  @Input() color: string = '#ddd';
  @Input() margin: string = '8px 0';
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() thickness: string = '1px'; 
  @Input() length: string = '100%'; 
  @Input() style: 'solid' | 'dashed' | 'dotted' = 'solid';
}
