import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly baseUrl = 'https://dummyjson.com/products';
  private cache = new Map<string, Product>();
  private selectedProduct: Product | null = null;
  constructor(private http: HttpClient) {}

  setSelectedProduct(product: Product | null) {
    this.selectedProduct = product;
  }

  getSelectedProduct(): Product | null {
    return this.selectedProduct;
  }

  getProductById(id: string | number | null): Observable<Product | null> {
    if (id == null || id === '') return of(null);

    const key = String(id);

    // Instant returns from memory
    if (this.selectedProduct && String(this.selectedProduct.id) === key) {
      return of(this.selectedProduct);
    }
    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }

    // Fetch once, cache, and surface null on error
    return this.http.get<Product>(`${this.baseUrl}/${encodeURIComponent(key)}`).pipe(
      tap((p) => {
        this.selectedProduct = p;
        this.cache.set(key, p);
      }),
      catchError((err) => {
        console.error('getProductById failed:', err);
        return of(null);
      }),
      take(1)
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    if (!category || category.trim() === '') {
      return of([]);
    }
    const cat = category.trim().toLowerCase();

    return this.http.get<{ products: Product[] }>(`${this.baseUrl}/category/${encodeURIComponent(cat)}`).pipe(
      map((res) => res.products || []),
      tap((products) => {
        products.forEach((p) => {
          const key = String(p.id);
          this.cache.set(key, p);
        });
      }),
      catchError((err) => {
        console.error('getProductsByCategory failed:', err);
        return of([]);
      }),
      take(1)
    );
  }
}
