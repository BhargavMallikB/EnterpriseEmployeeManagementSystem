import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  status: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
  rating: number;
}

@Component({
  selector: 'lib-list',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input() viewMode: 'list' | 'grid' = 'list';
  @Input() products?: Product[];
  @Input() pickListSource?: string[];
  @Input() pickListTarget?: string[];
  @Input() orderList?: string[];

  buy(product: Product) {
    alert(`Buying ${product.name}`);
  }
  favorite(product: Product) {
    alert(`Favorited ${product.name}`);
  }
  moveToTarget(item: string) {
    if (!this.pickListSource || !this.pickListTarget) return;
    this.pickListSource = this.pickListSource.filter(i => i !== item);
    this.pickListTarget = [...this.pickListTarget, item];
  }
  moveToSource(item: string) {
    if (!this.pickListSource || !this.pickListTarget) return;
    this.pickListTarget = this.pickListTarget.filter(i => i !== item);
    this.pickListSource = [...this.pickListSource, item];
  }
  moveAllToTarget() {
    if (!this.pickListSource || !this.pickListTarget) return;
    this.pickListTarget = [...this.pickListTarget, ...this.pickListSource];
    this.pickListSource = [];
  }
  moveAllToSource() {
    if (!this.pickListSource || !this.pickListTarget) return;
    this.pickListSource = [...this.pickListSource, ...this.pickListTarget];
    this.pickListTarget = [];
  }
  moveUp(idx: number) {
    if (!this.orderList) return;
    if (idx > 0) {
      [this.orderList[idx - 1], this.orderList[idx]] = [this.orderList[idx], this.orderList[idx - 1]];
    }
  }
  moveDown(idx: number) {
    if (!this.orderList) return;
    if (idx < this.orderList.length - 1) {
      [this.orderList[idx + 1], this.orderList[idx]] = [this.orderList[idx], this.orderList[idx + 1]];
    }
  }
}
