import { NewBudgetComponent } from './home/budget-creator/new-budget/new-budget.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { MainPageComponent } from './home/main-page/main-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { RegisterPageComponent } from './register/register-panel/register-page/register-page.component';
import { DataResolver } from './resolvers/dataResolver.resolver';
import { NewBudgetResolver } from './resolvers/newBudgetResolver.resolver';
import { BudgetGuard } from './helpers/budget.guard';



const routes: Routes = [
  { path: '', redirectTo: '/main-page', pathMatch: 'full' },
  {path: 'main-page', component: MainPageComponent, canActivate: [AuthGuard, BudgetGuard],
        resolve: {dataPackage: DataResolver}
  },
  {path: 'login-page', component: LoginPageComponent},
  {path: 'new-budget', component: NewBudgetComponent, canActivate: [AuthGuard],
    resolve: {dataPackage: NewBudgetResolver}
  },
  {path: 'register-page', component: RegisterPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }