import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
import { Product } from '../shared/models/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  total: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  removeFromCart(productId: number) {
    this.productService.removeFromCart(productId);
  }

  updateQuantity(productId: number, event: any) {
    const value = event?.value ?? event;
    if (typeof value === 'number') {
      this.productService.updateCartItemQuantity(productId, value);
      this.calculateTotal();
    }
  }

  private calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
} 