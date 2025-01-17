import { Component } from '@angular/core';
import { FeatureProductComponent } from "../pages/feature-product/feature-product.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule,FeatureProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
