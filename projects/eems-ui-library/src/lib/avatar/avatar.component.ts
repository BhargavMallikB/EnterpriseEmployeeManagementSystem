import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-avatar',
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() alt = 'avatar';
  @Input() initials = '?';
  @Input() size: 'small' | 'medium' | 'large' | number = 'medium';
  @Input() bgColor = '#007bff';
  @Input() shape: 'circle' | 'round' | 'square' = 'round';
  @Input() status: 'online' | 'offline' | null = null;
  @Input() clickable = false;

  imageError = false;

  get avatarSize(): number {
    if (typeof this.size === 'number') return this.size;
    switch (this.size) {
      case 'small': return 32;
      case 'large': return 72;
      default: return 48;
    }
  }

  handleImageError() {
    this.imageError = true;
  }

  handleClick(): void {
    // Placeholder for click logic, can emit an event or perform an action
  }
}
