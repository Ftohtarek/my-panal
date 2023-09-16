import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'banners' },
  { path: 'banners', loadComponent: () => import('./private/components/upload-slider/upload-slider.component').then(m => m.UploadSliderComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
