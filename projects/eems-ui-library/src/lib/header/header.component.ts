import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'lib-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() logoUrl: string = 'assets/logo1.png';
  @Input() organizationName: string = 'Account Master Data';
  @Input() searchPlaceholder: string = 'Search this library';

  @Input() userName: string = 'User';
  @Input() userRole: string = 'Admin';
  @Input() userEmail: string = 'user@example.com';

  public isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe((result: any) => {
      this.isMobile = result.matches;
    });
  }
}
