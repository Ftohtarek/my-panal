import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'banners', pathMatch: 'full' },
  { path: 'banners', loadComponent: () => import('./private/components/upload-slider/upload-slider.component').then(m => m.UploadSliderComponent) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
