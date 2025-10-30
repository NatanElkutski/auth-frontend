import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatPaginatorModule, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TooltipDirective } from '../../directives/tooltip.directive';
import { PaginatorIntlService } from '../../services/paginatorIntl.service';
import { Product } from '../../model/product.model';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, TooltipDirective],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css'],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
})
export class CharactersComponent {
  private http = inject(HttpClient);
  private readonly step = 50;
  readonly fetching = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly allProducts = signal<Product[]>([]); // source of truth
  readonly filterKey = signal<'category' | 'brand' | null>(null);
  readonly filterValue = signal<string | null>(null);

  readonly itemsPerPage = signal(this.step);
  readonly currentPage = signal(0);

  readonly filteredProducts = computed(() => {
    const list = this.allProducts();
    const key = this.filterKey();
    const val = this.filterValue();
    return key && val ? list.filter((p) => (p as any)[key] === val) : list;
  });

  readonly pageSizeOptions = computed(() => {
    const n = this.filteredProducts().length;
    const opts: number[] = [];
    for (let i = this.step; i <= n; i += this.step) opts.push(i);
    if (n > 0 && n % this.step !== 0) opts.push(Math.ceil(n / this.step) * this.step);
    return opts.length ? opts : [this.step];
  });

  readonly productsToShow = computed(() => {
    const list = this.filteredProducts();
    const size = this.itemsPerPage();
    const page = this.currentPage();
    const start = page * size;
    return list.slice(start, start + size);
  });

  // keep itemsPerPage valid if data/filter changes
  private clampEffect = effect(() => {
    const opts = this.pageSizeOptions();
    const max = opts[opts.length - 1] ?? this.step;
    if (this.itemsPerPage() > max) {
      this.itemsPerPage.set(max);
      this.currentPage.set(0);
    }
  });

  constructor() {
    this.fetch();
  }

  fetch() {
    this.fetching.set(true);
    this.http
      .get<{ products: Product[] }>('https://dummyjson.com/products?limit=200')
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: ({ products }) => {
          this.allProducts.set(products);
          this.fetching.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to fetch products');
          this.fetching.set(false);
        },
      });
  }

  onItemsChange(e: PageEvent) {
    this.itemsPerPage.set(e.pageSize);
    this.currentPage.set(e.pageIndex);
  }

  filterProducts(key: 'category' | 'brand', value: string) {
    this.filterKey.set(key);
    this.filterValue.set(value);
    this.currentPage.set(0);
  }

  clearFilter() {
    this.filterKey.set(null);
    this.filterValue.set(null);
    this.currentPage.set(0);
  }

  trackById = (_: number, p: Product) => p.id;
}
