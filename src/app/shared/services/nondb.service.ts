
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
        { page: 'calendars', pageName: 'Academic Calendars', roles: ['super_admin', 'admin'] },
        { page: 'timetables', pageName: 'Academic Timetables', roles: ['super_admin', 'admin'] }
      ]
    },

    { page: 'admins', pageName: 'Admins', roles: ['super_admin', 'admin'],
      subPages: [
        { page: 'add_admin', pageName: 'Add Admin', roles: ['super_admin', 'admin'] },
        { page: 'manage_admins', pageName: 'Manage Admins', roles: ['super_admin', 'admin'] }
      ]
    },

    { page: 'lecturers', pageName: 'Lecturers', roles: ['super_admin', 'admin'],
      subPages: [
        { page: 'add_lecturer', pageName: 'Add Lecturer', roles: ['super_admin', 'admin'] },
        { page: 'manage_lecturers', pageName: 'Manage Lecturers', roles: ['super_admin', 'admin'] },
      ] 
    },

    { page: 'course_reps', pageName: 'Course Reps.', roles: ['super_admin', 'admin'],
      subPages: [
        { page: 'add_course_rep', pageName: 'Add Course Rep.', roles: ['super_admin', 'admin'] },
        { page: 'manage_course_reps', pageName: 'Manage Course Reps.', roles: ['super_admin', 'admin'] },
      ] 
    },
    
    { page: 'timetables', pageName: 'My Timetable', roles: ['lecturer','course_rep'] },

    { page: 'reports', pageName: 'Reports', roles: ['super_admin', 'admin','lecturer', 'course_rep'] },

  ];
  

}