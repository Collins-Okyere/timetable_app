import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiginComponent } from './sigin/sigin.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'sign_in',
        component: SiginComponent
      },
      {
        path: '',
        redirectTo: 'sign_in',
        pathMatch: 'full'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
