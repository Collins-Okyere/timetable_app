import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { LecturersModule } from './lecturers.module';
import { ReportsComponent } from '../shared/reports/reports.component';
import { TimetableComponent } from '../shared/timetable/timetable.component';

const routes: Routes = [
  {
    path: '',
    component: LecturersModule,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'timetables',
        component: TimetableComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
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
export class lecturersRoutingModule { }
