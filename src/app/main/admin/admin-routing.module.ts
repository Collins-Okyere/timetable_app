import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { ManageUsersComponent } from './users/manage-users/manage-users.component';
import { GeneralSetupComponent } from './general-setup/general-setup.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { LecturersComponent } from '../lecturers/lecturers.component';
import { AddLecturerComponent } from './lecturers/add-lecturer/add-lecturer.component';
import { ManageLecturersComponent } from './lecturers/manage-lecturers/manage-lecturers.component';
import { SchedulerComponent } from './general-setup/scheduler/scheduler.component';
import { AcademicStructureComponent } from './general-setup/academic-structure/academic-structure.component';
import { FacultiesComponent } from './general-setup/academic-structure/faculties/faculties.component';
import { DepartmentsComponent } from './general-setup/academic-structure/departments/departments.component';
import { CoursesComponent } from './general-setup/academic-structure/courses/courses.component';
import { CalendarsComponent } from './general-setup/calendar-and-timetable/calendars/calendars.component';
import { CalendarAndTimetableComponent } from './general-setup/calendar-and-timetable/calendar-and-timetable.component';
import { TimetablesComponent } from './general-setup/calendar-and-timetable/timetables/timetables.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'lecturers',
        component: LecturersComponent,
        children: [
          {
            path: 'add_lecturer',
            component: AddLecturerComponent
          },
          {
            path: 'manage_lecturers',
            component: ManageLecturersComponent
          },
          {
            path: '',
            redirectTo: 'manage_lecturers',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'users',
        component: UsersComponent,
        children: [
          {
            path: 'add_user',
            component: AddUserComponent
          },
          {
            path: 'manage_users',
            component: ManageUsersComponent
          },
          {
            path: '',
            redirectTo: 'manage_users',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'general_setup',
        component: GeneralSetupComponent,
        children: [
          {
            path: 'academic_structure',
            component: AcademicStructureComponent
          },
          {
            path: 'calendars_and_timetables',
            component: CalendarAndTimetableComponent
          },
          {
            path: 'scheduler',
            component: SchedulerComponent
          },
          {
            path: '',
            redirectTo: 'timetable',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
