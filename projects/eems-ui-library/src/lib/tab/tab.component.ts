import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface Tab {
  label: string;
  content: string;
}

@Component({
  selector: 'lib-tab',
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss'
})
export class TabComponent {
  @Input() tabs: Tab[] = [];
  activeIndex = 0;

  selectTab(index: number) {
    this.activeIndex = index;
  }
}
