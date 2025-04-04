import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
import { WishlistService } from '../shared/services/wishlist.service';
import { Product } from '../shared/models/product.model';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';

type SeverityType = 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  first: number = 0;
  rows: number = 9;
  totalRecords: number = 0;
  categories: string[] = [];
  selectedCategory: string | null = null;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.totalRecords = products.length;
        this.categories = [...new Set(products.map(p => p.category))];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
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

  toggleWishlist(product: Product) {
    console.log('Product data:', product); // Debug log
    
    if (!product) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Product not found'
      });
      return;
    }

    // Ensure we have a valid product ID
    const productId = product.id || product._id;
    if (!productId) {
      console.error('Invalid product ID:', product);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid product ID'
      });
      return;
    }

    if (this.wishlistService.isInWishlist(productId)) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product removed from wishlist'
          });
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to remove product from wishlist'
          });
        }
      });
    } else {
      // Create a clean product object with only the necessary fields
      const cleanProduct: Product = {
        id: productId,
        code: product.code || '',
        name: product.name || '',
        description: product.description || '',
        image: product.image || '',
        category: product.category || '',
        price: product.price || 0,
        quantity: product.quantity || 0,
        internalReference: product.internalReference || '',
        shellId: product.shellId || 0,
        inventoryStatus: product.inventoryStatus || 'INSTOCK',
        rating: product.rating || 0,
        createdAt: product.createdAt || Date.now(),
        updatedAt: product.updatedAt || Date.now()
      };

      this.wishlistService.addToWishlist(cleanProduct).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product added to wishlist'
          });
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add product to wishlist'
          });
        }
      });
    }
  }

  updateQuantity(product: Product, event: any) {
    const value = event?.value ?? event;
    if (typeof value === 'number' && product.id) {
      this.productService.updateCartItemQuantity(product.id, value);
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  filterByCategory(category: string | null) {
    this.selectedCategory = category;
  }

  get filteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter(product => product.category === this.selectedCategory);
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

  isInWishlist(productId: string | number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
} 