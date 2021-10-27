import { LoginPageComponent } from './login/login-page/login-page.component';
import { MainPageComponent } from './home/main-page/main-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './helpers/auth.guard';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);


const routes: Routes = [
  { path: '', redirectTo: '/login-page', pathMatch: 'full' },
  {path: 'main-page', component: MainPageComponent},
  {path: 'login-page', component: LoginPageComponent}
];

/*
const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
*/

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }