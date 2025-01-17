import { Component } from '@angular/core';
import { ProductService } from '../Product/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
export interface Product {
  _id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
}
@Component({
  selector: 'app-feature-product',
  imports: [CommonModule],
  templateUrl: './feature-product.component.html',
  styleUrl: './feature-product.component.css'
})
export class FeatureProductComponent {
  staticDiscountMessage = '25% OFF';
  products:Product[]=[];  
  constructor(private productService: ProductService, private router:Router) {}
  
    ngOnInit() {
      this.getProduct();
    }
  
    getProduct() {
      this.productService.getProducts().subscribe({
        next: (response:any) => {
          this.products = response;    
        },
        error: (error) => {
          console.error('Error loading products:', error);
        }
      });
    }
}
