import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { GeneralSetupComponent } from './general-setup/general-setup.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { LecturersComponent } from '../lecturers/lecturers.component';
import { AcademicStructureComponent } from './general-setup/academic-structure/academic-structure.component';
import { AddLecturerComponent } from './lecturers/add-lecturer/add-lecturer.component';
import { ManageLecturersComponent } from './lecturers/manage-lecturers/manage-lecturers.component';
import { CourseRepsComponent } from '../course-reps/course-reps.component';
import { AddCourseRepComponent } from './course-reps/add-course-rep/add-course-rep.component';
import { ManageCourseRepsComponent } from './course-reps/manage-course-reps/manage-course-reps.component';
import { AdminsComponent } from './admins/admins.component';
import { AddAdminComponent } from './admins/add-admin/add-admin.component';
import { ManageAdminsComponent } from './admins/manage-admins/manage-admins.component';
import { CalendarsComponent } from './general-setup/calendars/calendars.component';
import { TimetablesComponent } from './general-setup/timetables/timetables.component';
import { ReportsComponent } from '../shared/reports/reports.component';

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
        path: 'course_reps',
        component: CourseRepsComponent,
        children: [
          {
            path: 'add_course_rep',
            component: AddCourseRepComponent
          },
          {
            path: 'manage_course_reps',
            component: ManageCourseRepsComponent
          },
          {
            path: '',
            redirectTo: 'manage_course_reps',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'admins',
        component: AdminsComponent,
        children: [
          {
            path: 'add_admin',
            component: AddAdminComponent
          },
          {
            path: 'manage_admins',
            component: ManageAdminsComponent
          },
          {
            path: '',
            redirectTo: 'manage_admins',
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
            path: 'calendars',
            component: CalendarsComponent
          },
          {
            path: 'timetables',
            component: TimetablesComponent
          },
          {
            path: '',
            redirectTo: 'timetable',
            pathMatch: 'full'
          }
        ]
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
