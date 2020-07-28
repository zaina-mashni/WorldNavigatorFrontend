import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {JoinComponent} from './join/join.component';
import {StartComponent} from './start/start.component';
import {CreateComponent} from './create/create.component';
import {RegisterComponent} from './register/register.component';

const routes: Routes = [
  {path: 'register', pathMatch: 'full', component: RegisterComponent},
  {path: 'create', pathMatch: 'full', component: CreateComponent},
  {path: 'start', pathMatch: 'full', component: StartComponent},
  {path: 'join', pathMatch: 'full', component: JoinComponent},
  {path: 'login', pathMatch: 'full', component: LoginComponent},
  {path: '', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



