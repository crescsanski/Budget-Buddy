import { LoginPageComponent } from './login/login-page/login-page.component';
import { MainPageComponent } from './home/main-page/main-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/login-page', pathMatch: 'full' },
  {path: 'main-page', component: MainPageComponent},
  {path: 'login-page', component: LoginPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
