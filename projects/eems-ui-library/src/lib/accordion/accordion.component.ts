import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface AccordionItem {
  title: string;
  content: any;
}

@Component({
  selector: 'lib-accordion',
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css'
})
export class AccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() iconPosition: 'left' | 'right' = 'right';
  openIndexes: Set<number> = new Set();

  togglePanel(index: number) {
    if (this.openIndexes.has(index)) {
      // If clicking on already open panel, close it
      this.openIndexes.delete(index);
    } else {
      // If clicking on closed panel, close all others and open this one
      this.openIndexes.clear();
      this.openIndexes.add(index);
    }
  }

  isOpen(index: number): boolean {
    return this.openIndexes.has(index);
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
