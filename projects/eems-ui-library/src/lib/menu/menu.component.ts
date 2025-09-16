import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface MenuItem {
  label: string;
  icon?: string;
  children?: MenuItem[];
  header?: boolean; // For section headers
  separator?: boolean; // For separators
}

// Sample menu data for demo (replace with @Input() in real use)
export const DEMO_MENU: MenuItem[] = [
  { label: 'Customers', icon: 'fa fa-table', children: [
    { label: 'New', icon: 'fa fa-user-plus' },
    { label: 'Edit', icon: 'fa fa-user-edit' }
  ] },
  { label: 'Orders', icon: 'fa fa-shopping-cart', children: [
    { label: 'View', icon: 'fa fa-list' },
    { label: 'Search', icon: 'fa fa-search' }
  ] },
  { label: 'Shipments', icon: 'fa fa-envelope', children: [
    { label: 'Tracker', icon: 'fa fa-location-arrow' },
    { label: 'Map', icon: 'fa fa-map' },
    { label: 'Manage', icon: 'fa fa-cogs' }
  ] },
  { label: 'Profile', icon: 'fa fa-user', children: [
    { label: 'Settings', icon: 'fa fa-cog' },
    { label: 'Billing', icon: 'fa fa-credit-card' }
  ] },
  { label: 'Quit', icon: 'fa fa-sign-out' }
];

export const OVERLAY_MENU: MenuItem[] = [
  { label: 'Save', icon: 'fa fa-save' },
  { label: 'Update', icon: 'fa fa-sync' },
  { label: 'Delete', icon: 'fa fa-trash' },
  { label: '', separator: true },
  { label: 'Home', icon: 'fa fa-home' }
];

@Component({
  selector: 'lib-menu',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() menu: MenuItem[] = DEMO_MENU;
  @Input() type: 'menubar' | 'tabmenu' | 'overlay' | 'context' | 'horizontal-mega' | 'vertical-mega' | 'panel' | 'plain' = 'plain';
  openDropdown: string | null = null;
  selectedTabIndex: number = 0;
  openVerticalMega: number | null = null;
  openMap: { [key: string]: boolean } = {};
  searchTerm: string = '';
  demoInput: string = '';

  // Overlay Menu state
  showOverlay = false;

  // Context Menu state
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;

  // PanelMenu state
  panelOpenMap: { [key: string]: boolean } = {};

  get filteredMenu(): MenuItem[] {
    if (!this.searchTerm.trim()) return this.menu;
    return this.filterMenu(this.menu, this.searchTerm.trim().toLowerCase());
  }

  filterMenu(items: MenuItem[], term: string): MenuItem[] {
    return items
      .map(item => {
        const children = item.children ? this.filterMenu(item.children, term) : undefined;
        if (item.label.toLowerCase().includes(term) || (children && children.length)) {
          return { ...item, children };
        }
        return null;
      })
      .filter(Boolean) as MenuItem[];
  }

  toggle(item: MenuItem) {
    const key = this.getKey(item);
    this.openMap[key] = !this.openMap[key];
  }

  isOpen(item: MenuItem): boolean {
    return !!this.openMap[this.getKey(item)];
  }

  getKey(item: MenuItem): string {
    // Use label path as key (works for demo, for real use a unique id)
    return item.label + (item.children ? '-' + item.children.length : '');
  }

  // Context Menu logic
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    document.addEventListener('click', this.closeContextMenu);
  }

  closeContextMenu = () => {
    this.contextMenuVisible = false;
    document.removeEventListener('click', this.closeContextMenu);
  };

  // PanelMenu logic
  togglePanel(item: MenuItem) {
    const key = this.getKey(item);
    this.panelOpenMap[key] = !this.panelOpenMap[key];
  }

  isPanelOpen(item: MenuItem): boolean {
    return !!this.panelOpenMap[this.getKey(item)];
  }

  toggleDropdown(label: string) {
    this.openDropdown = this.openDropdown === label ? null : label;
  }
  closeDropdown() {
    this.openDropdown = null;
  }

  toggleVerticalMega(index: number) {
    this.openVerticalMega = this.openVerticalMega === index ? null : index;
  }

  setTab(index: number) {
    this.selectedTabIndex = index;
  }
}
