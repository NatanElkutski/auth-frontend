import { Component, ViewChild, inject, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutModule, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { AuthService } from '../../services/auth.service';

type NavItem = { label: string; link: string; icon: string };

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    LayoutModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  private router = inject(Router);
  readonly authService = inject(AuthService);
  private bp = inject(BreakpointObserver);

  readonly isHandset = signal(false);

  constructor() {
    this.bp.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((r) => {
      this.isHandset.set(r.matches);
      if (!r.matches && this.sidenav?.mode === 'over' && this.sidenav?.opened) {
        this.sidenav.close();
      }
    });
  }

  readonly navItems: NavItem[] = [
    { label: 'Home', link: '/home', icon: 'home' },
    { label: 'Products', link: '/products', icon: 'local_mall' },
    { label: 'Inbox', link: '/inbox', icon: 'inbox' },
    { label: 'Schedule', link: '/schedule', icon: 'event' },
    { label: 'Customers', link: '/customers', icon: 'groups' },
    { label: 'My Money', link: '/finance', icon: 'account_balance_wallet' },
    { label: 'Reporting', link: '/reports', icon: 'analytics' },
  ];
  trackByLabel = (_: number, item: NavItem) => item.label;

  async navigateAndClose(link: string) {
    await this.router.navigateByUrl(link);
    if (this.isHandset() && this.sidenav?.opened) this.sidenav.close();
  }

  goLogin = () => this.navigateAndClose('/login');
  goSignup = () => this.navigateAndClose('/signup');
  goProfile = () => this.navigateAndClose('/home');
  logout = () => {
    this.authService.logout();
    this.navigateAndClose('/login');
  };
}
