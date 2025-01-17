import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductFormComponent } from './pages/Product/product-form/product-form.component';
import { ProductListComponent } from './pages/Product/product-list/product-list.component';

export const routes: Routes = [
    {
        path:'',
        component:HomeComponent,
        pathMatch:'full'
    },
    {
        path:'product-form',
        component:ProductFormComponent,
    },
    {
        path:'product-list',
        component:ProductListComponent,
    },
    {
        path:'product-edit/:id',
        component:ProductFormComponent,
    }
];
