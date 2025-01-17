
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  productForm: FormGroup;
  isEditMode = false;
  productId: any;
  pageTitle = 'Add Product';
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      availability: ['', Validators.required],
      productId:['', Validators.required],
      description: [''],
      image: [null]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = params['id'];
        this.pageTitle = 'Edit Product';
        this.loadProductData(this.productId);
      }
    });
  }

  loadProductData(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          category: product.category, 
          price: product.price,
          availability: product.availability,
          productId:product.productId,
          description: product.description
         
        });
        if (product.image) {
          this.imagePreview = product.image;
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('category', this.productForm.get('category')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('availability', this.productForm.get('availability')?.value);
      formData.append('productId', this.productForm.get('productId')?.value);
      formData.append('description', this.productForm.get('description')?.value || '');
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      if (this.isEditMode && this.productId) {
        this.productService.updateProduct(this.productId, formData).subscribe({
          next: (response) => {
            this.productForm.reset();
            this.router.navigate(['/product-list']);
          },
          error: (error) => {
            console.error('Error updating product:', error);
          }
        });
      } else {
        this.productService.addProduct(formData).subscribe({
          next: (response) => {
            this.router.navigate(['/product-list']);
          },
          error: (error) => {
            console.error('Error adding product:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm() {
    this.productForm.reset();
    this.isEditMode = false;
    this.productId = null;
    this.pageTitle = 'Add Product';
    this.selectedFile = null;
    this.imagePreview = null;
  }
}