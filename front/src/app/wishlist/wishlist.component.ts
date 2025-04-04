import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/models/product.model';
import { WishlistService } from '../shared/services/wishlist.service';
import { ProductService } from '../shared/services/product.service';
import { MessageService } from 'primeng/api';

type SeverityType = 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.wishlistService.getWishlistItems().subscribe(items => {
      this.wishlistItems = items;
    });
  }

  removeFromWishlist(productId: string | number) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product removed from wishlist'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove product from wishlist'
        });
      }
    });
  }

  addToCart(product: Product) {
    this.productService.addToCart(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Product added to cart'
    });
  }

  getStatusSeverity(status: string): SeverityType {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }
} 