import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

export interface TableColumn {
  header: string;
  field: string;
  sortable?: boolean; // column-level sorting toggle
}

@Component({
  selector: 'lib-table',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T extends Record<string, any> = any> {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Output() pageChange = new EventEmitter<{ page: number, pageSize: number }>();

  // Configurable options
  @Input() globalSortable: boolean = false;
  @Input() paginated: boolean = false;
  @Input() pageSize: number = 5;
  @Input() prevLabel: string = 'Prev';
  @Input() nextLabel: string = 'Next';
  @Input() sortAscIcon: string = '↑';
  @Input() sortDescIcon: string = '↓';
  @Input() serverSidePagination: boolean = false;
  @Input() hasNext: boolean = false;
  @Input() hasPrev: boolean = false;
  @Input() totalCount: number = 0;

  // Optional: custom cell template
  @ContentChild('cellTemplate', { static: false })
  cellTemplate!: TemplateRef<any>;

  // State
  @Input() currentPage: number = 1;
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  get sortedData(): T[] {
    if ((!this.globalSortable && !this.columns.some(c => c.sortable)) || !this.sortField) {
      return this.data;
    }
    return [...this.data].sort((a, b) => {
      const v1 = a[this.sortField!];
      const v2 = b[this.sortField!];
      const compare = v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
      return this.sortDirection === 'asc' ? compare : -compare;
    });
  }

  get pagedData(): T[] {
    if (!this.paginated) return this.sortedData;
    if (this.serverSidePagination) return this.sortedData;
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedData.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    if (this.serverSidePagination) {
      return this.pageSize > 0 ? Math.ceil(this.totalCount / this.pageSize) || 1 : 1;
    }
    return Math.ceil(this.sortedData.length / this.pageSize) || 1;
  }

  changeSort(field: string, columnSortable?: boolean) {
    if (!columnSortable && !this.globalSortable) return;
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  changePage(page: number) {
    if (this.serverSidePagination) {
      this.pageChange.emit({ page, pageSize: this.pageSize });
    } else if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit({ page, pageSize: this.pageSize });
    }
  }
}
