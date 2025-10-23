
import { Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NonDbService {

  currUser:any = {};

  menu:any = [

    { page: 'dashboard', pageName: 'Dashboard', roles: ['admin', 'lecturer', 'student'] },

    { page: 'general_setup', pageName: 'General Setup', roles: ['admin'],
      subPages: [
        { page: 'academic_structure', pageName: 'Academic Structure', roles: ['admin'] },
        { page: 'calendars', pageName: 'Academic Calendars', roles: ['admin'] },
        { page: 'timetables', pageName: 'Academic Timetables', roles: ['admin'] }
      ]
    },

    { page: 'admins', pageName: 'Admins', roles: ['admin'],
      subPages: [
        { page: 'add_admin', pageName: 'Add Admin', roles: ['admin'] },
        { page: 'manage_admins', pageName: 'Manage Admins', roles: ['admin'] }
      ]
    },

    { page: 'lecturers', pageName: 'Lecturers', roles: ['admin'],
      subPages: [
        { page: 'add_lecturer', pageName: 'Add Lecturer', roles: ['admin'] },
        { page: 'manage_lecturers', pageName: 'Manage Lecturers', roles: ['admin'] },
      ] 
    },

    { page: 'students', pageName: 'Students', roles: ['admin'],
      subPages: [
        { page: 'add_student', pageName: 'Add Student', roles: ['admin'] },
        { page: 'manage_students', pageName: 'Manage Students', roles: ['admin'] },
      ] 
    },
    
    { page: 'timetables', pageName: 'My Timetable', roles: ['lecturer','student'] },

    { page: 'reports', pageName: 'Reports', roles: ['admin','lecturer', 'student'] },

  ];
  

}