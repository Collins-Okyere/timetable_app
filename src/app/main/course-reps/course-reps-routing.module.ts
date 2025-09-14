import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { CourseRepsComponent } from './course-reps.component';

const routes: Routes = [
  {
    path: '',
    component: CourseRepsComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRepsRoutingModule { }
