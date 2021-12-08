import { NewBudgetComponent } from './home/budget-creator/new-budget/new-budget.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { MainPageComponent } from './home/main-page/main-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { RegisterPageComponent } from './register/register-page/register-page.component';



const routes: Routes = [
  { path: '', redirectTo: '/main-page', pathMatch: 'full' },
  {path: 'main-page', component: MainPageComponent, /*canActivate: [AuthGuard]*/},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'new-budget', component: NewBudgetComponent},
  {path: 'register-page', component: RegisterPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }