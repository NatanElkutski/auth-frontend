import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../model/product.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-product',
  imports: [
    RouterLink,
    CommonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatListModule,
    MatCardModule,
    MatSelectModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  private route = inject(ActivatedRoute);
  private scroller = inject(ViewportScroller);
  private router = inject(Router);
  private productService = inject(ProductsService);
  private bp = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  isHandset = signal(false);
  product = signal<Product | null>(this.productService.getSelectedProduct());
  selectedImageIndex = 0;
  quantity = 1;
  readonly relatedProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // Fetch new product data here...

      // Use the Angular method:
      this.scroller.scrollToPosition([0, 0]);
      // Or simply:
      // this.scroller.scrollToPosition();
    });
  }

  constructor() {
    // react to handset
    this.bp
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((r) => this.isHandset.set(r.matches));

    // react to route /product/:id changes
    this.route.paramMap
      .pipe(
        map((p) => p.get('id')),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((id) => {
        if (!id) {
          this.product.set(null);
          this.router.navigate(['/products']);
          return;
        }
        if (this.product()?.id === Number(id)) return; // already loaded
        // fetch product for this id
        this.productService
          .getProductById(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (p) => this.product.set(p),
            error: () => {
              this.product.set(null);
              this.router.navigate(['/products']);
            },
          });
      });

    // whenever product changes to a value with a category -> load related
    effect(() => {
      const cat = this.product()?.category?.trim().toLowerCase();
      if (cat) {
        this.loadRelated(cat); // will set relatedProducts()
      } else {
        this.relatedProducts.set([]);
      }
    });
  }

  addToCart = (p: Product | null, qty: number) => {
    if (!p || qty <= 0) return;
    alert(`Added ${qty} of "${p.title}" to cart (not really, this is a demo).`);
  };

  buyNow = (p: Product | null) => {
    if (!p) return;
    alert(`Proceeding to buy "${p.title}" (not really, this is a demo).`);
  };

  hasDiscount(p: any): boolean {
    return typeof p?.discountPercentage === 'number' && p.discountPercentage > 0;
  }

  finalPrice(p: any): number {
    if (!this.hasDiscount(p)) return p.price ?? 0;
    const pct = p.discountPercentage / 100;
    return Math.round(p.price * (1 - pct) * 100) / 100; // round to cents
  }

  loadRelated(category: string): void {
    this.productService
      .getProductsByCategory(category)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => this.relatedProducts.set(products.filter((p) => p.id !== this.product()?.id)),
        error: () => this.relatedProducts.set([]),
      });
  }

  goToRelatedProduct = (p: Product) => {
    this.productService.getProductById(p.id).subscribe({
      next: (el) => this.product.set(el),
      error: () => {
        this.product.set(null);
        this.router.navigate(['/products']);
      },
    });
    this.router.navigate(['/products', p.id]);
  };

  mathRound = (num: number) => Math.round(num);

  ngOnDestroy(): void {
    this.productService.setSelectedProduct(null);
  }
}
