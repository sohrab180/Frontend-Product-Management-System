import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  availability?: 'Available' | 'Unavailable';
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:5000/api/v5/project_management';

  constructor(private http: HttpClient) {}

  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, formData);
  }

  // Update product with image
  updateProduct(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, formData);
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }
  getProductById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/product/${id}`); 
  }
  updateProjectStatus(id: string, availability: string) {
    return this.http.put(`${this.baseUrl}/update-delete/${id}`, { availability });
  }
}
