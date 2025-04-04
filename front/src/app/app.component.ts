import { Component, OnInit } from '@angular/core';
import { ProductService } from './shared/services/product.service';
import { WishlistService } from './shared/services/wishlist.service';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  cartItemCount: number = 0;
  wishlistItemCount: number = 0;
  sidebarVisible: boolean = false;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getCartItems().subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    this.wishlistService.getWishlistItems().subscribe(items => {
      this.wishlistItemCount = items.length;
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  getCurrentPageTitle(): string {
    const path = this.router.url;
    switch (path) {
      case '/products':
        return 'Products';
      case '/cart':
        return 'Shopping Cart';
      case '/wishlist':
        return 'My Wishlist';
      case '/contact':
        return 'Contact Us';
      default:
        return 'Alten Shop';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
