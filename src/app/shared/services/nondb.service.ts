
import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NonDbService {

  currUser:any = {
    id: 0,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    photo: '',
    user_role: ''
  }

  menu:any = [
    { page: 'dashboard', pageName: 'Dashboard', roles: ['super_admin', 'admin', 'lecturer', 'course_rep'] },

    { page: 'general_setup', pageName: 'General Setup', roles: ['super_admin', 'admin'],
      subPages: [
        { page: 'academic_structure', pageName: 'Academic Structure', roles: ['super_admin', 'admin'] },
        { page: 'calendars_and_timetables', pageName: 'Calendars / Timetables', roles: ['super_admin', 'admin'] },
        { page: 'scheduler', pageName: 'Scheduler', roles: ['super_admin', 'admin'] }
      ]
    },

    { page: 'users', pageName: 'Users', roles: ['super_admin', 'admin'],
      subPages: [
        { page: 'add_user', pageName: 'Add User', roles: ['super_admin', 'admin'] },
        { page: 'manage_users', pageName: 'Manage Users', roles: ['super_admin', 'admin'] }
      ]
    },

    { page: 'lecturers', pageName: 'Lecturers', roles: ['super_admin', 'admin'],
      subPages: [
        { page: 'add_lecturer', pageName: 'Add Lecturer', roles: ['super_admin', 'admin'] },
        { page: 'manage_lecturers', pageName: 'Manage Lecturers', roles: ['super_admin', 'admin'] },
      ] 
    },
    
    { page: 'my_timetable', pageName: 'My Timetable', roles: ['lecturer'] },

    { page: 'timetable', pageName: 'Timetable', roles: ['courseRep'] },

    { page: 'my_records', pageName: 'My Records', roles: ['lecturer'] },

  ];
  

}