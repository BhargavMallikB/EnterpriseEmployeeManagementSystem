import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  @Input() size: number = 40;
  @Input() color: string = '#1976d2';
  @Input() show: boolean = true;
  @Input() message: string = '';
  @Input() type: 'circular' | 'dual-ring' | 'dots' | 'bar' | 'half-circle' | 'pulse' | 'segmented' | 'sun' | 'striped-bar' | 'faded-segments' = 'circular';
}
