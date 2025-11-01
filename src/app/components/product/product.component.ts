import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
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
  readonly productId: string | null;
  private route = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  product = signal<Product | null>(this.productService.getSelectedProduct());
  selectedImageIndex = 0;
  quantity = 1;

  constructor(private router: Router) {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (!this.product() || this.product()!.id.toString() !== this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (p) => {
          this.product.set(p);
        },
        error: (err) => {
          this.product.set(null);
          this.router.navigate(['/products']);
        },
      });
    }
  }

  addToCart = (p: Product | null, qty: number) => {
    if (!p || qty <= 0) return;
    alert(`Added ${qty} of "${p.title}" to cart (not really, this is a demo).`);
  };

  buyNow = (p: Product | null) => {
    if (!p) return;
    alert(`Proceeding to buy "${p.title}" (not really, this is a demo).`);
  };

  mathRound = (num: number) => Math.round(num);

  ngOnDestroy(): void {
    this.productService.setSelectedProduct(null);
  }
}
