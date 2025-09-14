import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { LecturersModule } from './lecturers.module';
import { MyRecordsComponent } from './my-records/my-records.component';
import { MyTimetableComponent } from './my-timetable/my-timetable.component';

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
        path: 'my_timetable',
        component: MyTimetableComponent
      },
      {
        path: 'my_records',
        component: MyRecordsComponent
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
