import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MainAppComponent } from './main/main.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
    },
    {
        path: 'admin',
        component: MainAppComponent,
        loadChildren: () => import('./main/admin/admin.module').then((m) => m.AdminModule)
    },
    {
        path: 'lecturer',
        component: MainAppComponent,
        loadChildren: () => import('./main/lecturers/lecturers.module').then((m) => m.LecturersModule)
    },
    {
        path: 'student',
        component: MainAppComponent,
        loadChildren: () => import('./main/students/students.module').then((m) => m.CourseRepModule)
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];
