import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
  active?: boolean;
  urlIsActive?: boolean;
}

@Component({
  selector: 'lib-breadcrumb',
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() separator: string = '>';
}
