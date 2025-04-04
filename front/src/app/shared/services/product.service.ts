import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api';
  private cartItems: Product[] = [];
  private cartItemsSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const productId = product.id || product._id;
    if (!productId) return;

    const existingItem = this.cartItems.find(item => 
      (item.id === productId || item._id === productId)
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ ...product, quantity });
    }
    this.cartItemsSubject.next([...this.cartItems]);
  }

  removeFromCart(productId: string | number): void {
    this.cartItems = this.cartItems.filter(item => 
      item.id !== productId && item._id !== productId
    );
    this.cartItemsSubject.next([...this.cartItems]);
  }

  updateCartItemQuantity(productId: string | number, quantity: number): void {
    const item = this.cartItems.find(item => 
      item.id === productId || item._id === productId
    );
    if (item) {
      item.quantity = quantity;
      this.cartItemsSubject.next([...this.cartItems]);
    }
  }

  getCartItems(): Observable<Product[]> {
    return this.cartItemsSubject.asObservable();
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartItemsSubject.next([]);
  }
} 