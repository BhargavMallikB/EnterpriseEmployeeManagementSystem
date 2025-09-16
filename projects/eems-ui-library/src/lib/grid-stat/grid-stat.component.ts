import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-grid-stat',
  imports: [CommonModule],
  templateUrl: './grid-stat.component.html',
  styleUrl: './grid-stat.component.scss'
})
export class GridStatComponent {
  @Input() value!: string;             
  @Input() change!: string;            
  @Input() isIncrease = true;          
  @Input() subtitle!: string;          
  @Input() color: 'purple' | 'blue' | 'orange' | 'red' = 'purple'; 
  @Input() chartData: number[] = [];
  @Input() size: 'small' | 'medium' | 'large' | string = 'medium';
}
