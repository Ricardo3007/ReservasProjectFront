import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren:()=> import('./views/auth/auth.routes')
  },
  {
    path: 'home',
    canActivate:[authGuard],
    loadChildren:()=> import('./views/home/home.routes')
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
