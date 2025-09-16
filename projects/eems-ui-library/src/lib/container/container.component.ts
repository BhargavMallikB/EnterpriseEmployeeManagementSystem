import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-container',
  imports: [CommonModule],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent {
  @Input() customClass = '';

  
  @Input() title = '';  

  // Layout inputs
  @Input() direction: 'row' | 'column' = 'column';
  @Input() justifyContent = 'flex-start';
  @Input() alignItems = 'stretch';
  @Input() wrap: 'wrap' | 'nowrap' = 'nowrap';
  @Input() gap = '0';

  // Style inputs
  @Input() backgroundColor = '#ffffff';
  @Input() padding = '1rem';
  @Input() margin = '0 auto';
  @Input() borderRadius = '8px';
  @Input() boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  @Input() width = '100%';
  @Input() maxWidth = '1200px';
  @Input() minHeight: string | null = null;
}
