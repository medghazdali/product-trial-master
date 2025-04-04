# Product Trial Project / Projet d'Essai Produit

## Project Overview / Vue d'ensemble
This project is an e-commerce platform for Alten with both front-end and back-end components. The implementation can be done as front-end only, back-end only, or full-stack.

Ce projet est une plateforme e-commerce pour Alten avec des composants front-end et back-end. L'implémentation peut être réalisée en front-end uniquement, back-end uniquement, ou en full-stack.

## Front-end Features / Fonctionnalités Front-end

### Part 1: Shop / Partie 1: Boutique
- Display all relevant product information in the list
- Add products to cart from the list
- Remove products from cart
- Display a badge showing the number of products in cart
- View the list of products in the cart

### Part 2: Contact Form / Partie 2: Formulaire de Contact
- Create a new menu item in the sidebar ("Contact")
- Create a "Contact" page with a form
- Form fields:
  - Email (required)
  - Message (required, max 300 characters)
- Display success message after submission

### Bonus Features / Fonctionnalités Bonus
- Product pagination and/or filtering
- Product quantity adjustment in list and cart views

## Back-end Features / Fonctionnalités Back-end

### Part 1: Product Management / Partie 1: Gestion des Produits
- RESTful API endpoints:
  | Resource           | POST                  | GET                            | PATCH                                    | PUT | DELETE           |
  | ------------------ | --------------------- | ------------------------------ | ---------------------------------------- | --- | ---------------- |
  | **/products**      | Create a new product  | Retrieve all products          | X                                        | X   |     X            |
  | **/products/:id**  | X                     | Retrieve details for product 1 | Update details of product 1 if it exists | X   | Remove product 1 |

- Product model:
```typescript
class Product {
  id: number;
  code: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  quantity: number;
  internalReference: string;
  shellId: number;
  inventoryStatus: "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
  rating: number;
  createdAt: number;
  updatedAt: number;
}
```

### Part 2: Authentication & User Features / Partie 2: Authentification & Fonctionnalités Utilisateur
- JWT-based authentication
- User registration and login endpoints:
  - [POST] /account (Registration)
  - [POST] /token (Login)
- Admin privileges (admin@admin.com)
- Shopping cart management
- Wishlist functionality

## Technical Stack / Stack Technique
- Front-end: Modern web technologies
- Back-end options:
  - Node.js/Express
  - Java/Spring Boot
  - C#/.NET Core
  - PHP/Symphony (without API Platform)

## Database / Base de données
- SQL/NoSQL database support
- JSON file storage option

## Testing / Tests
- API testing strategy
- Optional Postman/Swagger documentation