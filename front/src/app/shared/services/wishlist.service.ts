import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:3000/api';
  private wishlistItems: Product[] = [];
  private wishlistItemsSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    this.loadWishlist();
  }

  private loadWishlist() {
    this.http.get<Product[]>(`${this.apiUrl}/wishlist`).subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.wishlistItemsSubject.next([...this.wishlistItems]);
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.wishlistItems = [];
        this.wishlistItemsSubject.next([]);
      }
    });
  }

  addToWishlist(product: Product): Observable<any> {
    if (!product) {
      return throwError(() => new Error('Invalid product'));
    }

    const productId = product.id || product._id;
    if (!productId) {
      return throwError(() => new Error('Invalid product ID'));
    }

    return this.http.post(`${this.apiUrl}/wishlist/${productId}`, {}).pipe(
      tap(() => {
        if (!this.wishlistItems.find(item => (item.id === productId || item._id === productId))) {
          this.wishlistItems.push(product);
          this.wishlistItemsSubject.next([...this.wishlistItems]);
        }
      }),
      catchError(error => {
        console.error('Error adding to wishlist:', error);
        return throwError(() => error);
      })
    );
  }

  removeFromWishlist(productId: string | number): Observable<any> {
    if (!productId) {
      return throwError(() => new Error('Invalid product ID'));
    }

    // Convert to string for comparison
    const idToRemove = productId.toString();

    return this.http.delete(`${this.apiUrl}/wishlist/${idToRemove}`).pipe(
      tap(() => {
        this.wishlistItems = this.wishlistItems.filter(item => {
          const itemId = (item.id || item._id)?.toString();
          return itemId !== idToRemove;
        });
        this.wishlistItemsSubject.next([...this.wishlistItems]);
      }),
      catchError(error => {
        console.error('Error removing from wishlist:', error);
        return throwError(() => error);
      })
    );
  }

  getWishlistItems(): Observable<Product[]> {
    return this.wishlistItemsSubject.asObservable();
  }

  isInWishlist(productId: string | number): boolean {
    if (!productId) return false;
    return this.wishlistItems.some(item => 
      item.id === productId || item._id === productId
    );
  }

  getWishlistItemCount(): number {
    return this.wishlistItems.length;
  }
} 