
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';


interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  availability: string;
  image: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  statusFilter: string = '';
  nameFilter: string = '';
  categoryFilter: string = '';
  priceFilter: any;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private productService: ProductService, private router:Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        this.products = response;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  applyFilter1s() {
    let filtered = [...this.products];
    if (this.nameFilter) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(this.nameFilter.toLowerCase())
      );
    }
    if (this.categoryFilter) {
      console.log("Category Filter:", this.categoryFilter);
      filtered = filtered.filter(product =>
        product.category &&
        product.category.toLowerCase().trim() === this.categoryFilter.toLowerCase().trim()
      );
    }
    if (this.priceFilter) {
      filtered = filtered.filter(product => 
        product.price <= this.priceFilter
      );
    }
     if (this.statusFilter) {
      filtered = filtered.filter(
        (user) => user.availability === this.statusFilter
      );
    }
    this.filteredProducts = filtered;
    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
  }

  applyFilters() {
    let filtered = [...this.products];
    if (this.nameFilter) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.nameFilter.toLowerCase().trim())
      );
    }
    if (this.categoryFilter) {
      filtered = filtered.filter(product =>
        product.category &&
        product.category.toLowerCase().trim() === this.categoryFilter.toLowerCase().trim()
      );
    }
    if (this.priceFilter) {
      filtered = filtered.filter(product =>
        product.price <= this.priceFilter
      );
    }
    if (this.statusFilter) {
      filtered = filtered.filter(product =>
        product.availability === this.statusFilter
      );
    }
    this.filteredProducts = filtered;
    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
  }
  
  clearFilters() {
    this.nameFilter = '';
    this.categoryFilter = '';
    this.priceFilter = null;
    this.applyFilters();
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  editProduct(id:any){
    this.router.navigateByUrl(`product-edit/${id}`);
  }
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  }

  deleteProduct(id: string): void {
    this.deleteProduct
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.updateProjectStatus(id, 'UnAvailable').subscribe({
        next: (res: any) => {
          if (res && res.product) {
            const index = this.products.findIndex(product => product._id === id);
            if (index !== -1) {
              this.products[index].availability = 'UnAvailable';
              this.applyFilters();
            }
            alert('Product has been marked as unavailable');
          } else {
            alert('Failed to update product status');
          }
        },
        error: (error) => {
          console.error('Error updating product status:', error);
          alert('Failed to update product status');
        }
      });
    }
  }
}