import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-progressbar',
  imports: [CommonModule],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.scss'
})
export class ProgressbarComponent {
  @Input() value = 0;
  @Input() color = '#007bff';
  @Input() height = '8px';
  @Input() showValue = false;      
  @Input() valuePosition: 'inside' | 'outside' = 'inside';  
}
