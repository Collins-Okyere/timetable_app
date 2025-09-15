import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LocalDbService {

  [key: string]: any

  countries = [
    {
      id: 1,
      name: 'Ghana',
      flag: 'https://flagcdn.com/w320/gh.png',
      continent: 'Africa',
      native: 'Ghanaian',
    },
    {
      id: 2,
      name: 'Ethiopia',
      flag: 'https://flagcdn.com/w320/et.png',
      continent: 'Africa',
      native: 'Ethiopian',
    },
    {
      id: 3,
      name: 'Kenya',
      flag: 'https://flagcdn.com/w320/ke.png',
      continent: 'Africa',
      native: 'Kenyan',
    },
    {
      id: 4,
      name: 'Nigeria',
      flag: 'https://flagcdn.com/w320/ng.png',
      continent: 'Africa',
      native: 'Nigerian',
    },
    {
      id: 5,
      name: 'South Africa',
      flag: 'https://flagcdn.com/w320/za.png',
      continent: 'Africa',
      native: 'South African',
    },
    {
      id: 6,
      name: 'Congo (Democratic Republic)',
      flag: 'https://flagcdn.com/w320/cd.png',
      continent: 'Africa',
      native: 'Congolese',
    },
    {
      id: 7,
      name: 'Brazil',
      flag: 'https://flagcdn.com/w320/br.png',
      continent: 'South America',
      native: 'Brazilian',
    },
    {
      id: 8,
      name: 'Mexico',
      flag: 'https://flagcdn.com/w320/mx.png',
      continent: 'North America',
      native: 'Mexican',
    },
    {
      id: 9,
      name: 'United States',
      flag: 'https://flagcdn.com/w320/us.png',
      continent: 'North America',
      native: 'American',
    },
    {
      id: 10,
      name: 'Argentina',
      flag: 'https://flagcdn.com/w320/ar.png',
      continent: 'South America',
      native: 'Argentinian',
    },
    {
      id: 11,
      name: 'Colombia',
      flag: 'https://flagcdn.com/w320/co.png',
      continent: 'South America',
      native: 'Colombian',
    },
    {
      id: 12,
      name: 'Chile',
      flag: 'https://flagcdn.com/w320/cl.png',
      continent: 'South America',
      native: 'Chilean',
    },
    {
      id: 13,
      name: 'Peru',
      flag: 'https://flagcdn.com/w320/pe.png',
      continent: 'South America',
      native: 'Peruvian',
    },
    {
      id: 14,
      name: 'Venezuela',
      flag: 'https://flagcdn.com/w320/ve.png',
      continent: 'South America',
      native: 'Venezuelan',
    },
    {
      id: 15,
      name: 'Italy',
      flag: 'https://flagcdn.com/w320/it.png',
      continent: 'Europe',
      native: 'Italian',
    },
    {
      id: 16,
      name: 'France',
      flag: 'https://flagcdn.com/w320/fr.png',
      continent: 'Europe',
      native: 'French',
    },
    {
      id: 17,
      name: 'Spain',
      flag: 'https://flagcdn.com/w320/es.png',
      continent: 'Europe',
      native: 'Spanish',
    },
    {
      id: 18,
      name: 'Poland',
      flag: 'https://flagcdn.com/w320/pl.png',
      continent: 'Europe',
      native: 'Pole',
    },
    {
      id: 19,
      name: 'Russia',
      flag: 'https://flagcdn.com/w320/ru.png',
      continent: 'Europe/Asia',
      native: 'Russian',
    },
    {
      id: 20,
      name: 'Germany',
      flag: 'https://flagcdn.com/w320/de.png',
      continent: 'Europe',
      native: 'German',
    },
    {
      id: 21,
      name: 'Ukraine',
      flag: 'https://flagcdn.com/w320/ua.png',
      continent: 'Europe',
      native: 'Ukrainian',
    },
    {
      id: 22,
      name: 'Portugal',
      flag: 'https://flagcdn.com/w320/pt.png',
      continent: 'Europe',
      native: 'Portuguese',
    },
    {
      id: 23,
      name: 'Romania',
      flag: 'https://flagcdn.com/w320/ro.png',
      continent: 'Europe',
      native: 'Romanian',
    },
    {
      id: 24,
      name: 'Hungary',
      flag: 'https://flagcdn.com/w320/hu.png',
      continent: 'Europe',
      native: 'Hungarian',
    },
    {
      id: 25,
      name: 'Philippines',
      flag: 'https://flagcdn.com/w320/ph.png',
      continent: 'Asia',
      native: 'Filipino',
    },
    {
      id: 26,
      name: 'Australia',
      flag: 'https://flagcdn.com/w320/au.png',
      continent: 'Oceania',
      native: 'Australian',
    },
    {
      id: 27,
      name: 'Japan',
      flag: 'https://flagcdn.com/w320/jp.png',
      continent: 'Asia',
      native: 'Japanese',
    },
    {
      id: 28,
      name: 'South Korea',
      flag: 'https://flagcdn.com/w320/kr.png',
      continent: 'Asia',
      native: 'South Korean',
    },
    {
      id: 29,
      name: 'India',
      flag: 'https://flagcdn.com/w320/in.png',
      continent: 'Asia',
      native: 'Indian',
    },
    {
      id: 30,
      name: 'China',
      flag: 'https://flagcdn.com/w320/cn.png',
      continent: 'Asia',
      native: 'Chinese',
    },
    {
      id: 31,
      name: 'Indonesia',
      flag: 'https://flagcdn.com/w320/id.png',
      continent: 'Asia',
      native: 'Indonesian',
    },
    {
      id: 32,
      name: 'Turkey',
      flag: 'https://flagcdn.com/w320/tr.png',
      continent: 'Europe/Asia',
      native: 'Turkish',
    },
    {
      id: 33,
      name: 'Saudi Arabia',
      flag: 'https://flagcdn.com/w320/sa.png',
      continent: 'Asia',
      native: 'Saudi',
    },
    {
      id: 34,
      name: 'Egypt',
      flag: 'https://flagcdn.com/w320/eg.png',
      continent: 'Africa',
      native: 'Egyptian',
    },
    {
      id: 35,
      name: 'Thailand',
      flag: 'https://flagcdn.com/w320/th.png',
      continent: 'Asia',
      native: 'Thai',
    },
    {
      id: 36,
      name: 'Malaysia',
      flag: 'https://flagcdn.com/w320/my.png',
      continent: 'Asia',
      native: 'Malaysian',
    },
    {
      id: 37,
      name: 'Canada',
      flag: 'https://flagcdn.com/w320/ca.png',
      continent: 'North America',
      native: 'Canadian',
    },
    {
      id: 38,
      name: 'United Kingdom',
      flag: 'https://flagcdn.com/w320/gb.png',
      continent: 'Europe',
      native: 'British',
    },
    {
      id: 39,
      name: 'Netherlands',
      flag: 'https://flagcdn.com/w320/nl.png',
      continent: 'Europe',
      native: 'Dutch',
    },
    {
      id: 40,
      name: 'Sweden',
      flag: 'https://flagcdn.com/w320/se.png',
      continent: 'Europe',
      native: 'Swedish',
    },
    {
      id: 41,
      name: 'Switzerland',
      flag: 'https://flagcdn.com/w320/ch.png',
      continent: 'Europe',
      native: 'Swiss',
    },
    {
      id: 42,
      name: 'Greece',
      flag: 'https://flagcdn.com/w320/gr.png',
      continent: 'Europe',
      native: 'Greek',
    },
    {
      id: 43,
      name: 'New Zealand',
      flag: 'https://flagcdn.com/w320/nz.png',
      continent: 'Oceania',
      native: 'New Zealander',
    },
    {
      id: 44,
      name: 'Norway',
      flag: 'https://flagcdn.com/w320/no.png',
      continent: 'Europe',
      native: 'Norwegian',
    },
    {
      id: 45,
      name: 'Denmark',
      flag: 'https://flagcdn.com/w320/dk.png',
      continent: 'Europe',
      native: 'Dane',
    },
    {
      id: 46,
      name: 'Finland',
      flag: 'https://flagcdn.com/w320/fi.png',
      continent: 'Europe',
      native: 'Finn',
    },
    {
      id: 47,
      name: 'Belgium',
      flag: 'https://flagcdn.com/w320/be.png',
      continent: 'Europe',
      native: 'Belgian',
    },
  ]

  faculties: any = [
    {
      id: 1,
      name: 'Faculty of Biomedical Sciences',
      code: 'FOS',
      is_new: false,
      is_active: true
    },
    {
      id: 2,
      name: 'Faculty of Arts',
      code: 'FOA',
      is_new: false,
      is_active: true
    },
  ]

  departments: any = [
    {
      id: 1,
      name: 'Dept. of Sociology',
      code: 'DS',
      faculty: this.faculties[1],
    },
    {
      id: 2,
      name: 'Dentistry Department',
      code: 'DD',
      faculty: this.faculties[0],
    },
  ]

  academic_levels:any = [
    {
      id: 1,
      name: 'Level 100',
      code: 'L1',
      is_new: false,
      is_active: true
    },
    {
      id: 2,
      name: 'Level 200',
      code: 'L2',
      is_new: false,
      is_active: true
    },
    {
      id: 3,
      name: 'Level 300',
      code: 'L3',
      is_new: false,
      is_active: true
    },
    {
      id: 4,
      name: 'Level 400',
      code: 'L4',
      is_new: false,
      is_active: true
    },
    {
      id: 5,
      name: 'Level 500 (Post Graduate)',
      code: 'L5',
      is_new: false,
      is_active: true
    },
    {
      id: 6,
      name: 'Level 600 (Post Graduate)',
      code: 'L6',
      is_new: false,
      is_active: true
    },
    {
      id: 7,
      name: 'Level 700 (Post Graduate)',
      code: 'L7',
      is_new: false,
      is_active: true
    }
  ]

  courses: any = [
    {
      id: 1,
      name: 'Introduction to Sociology',
      code: 'IS',
      departments: [this.departments[0]],
      levels: [this.academic_levels[0]],
      course_type: 'On Campus',
      is_active: true
    },
    {
      id: 2,
      name: 'Intro. to Basic Dentistry',
      code: 'IBD',
      departments: [this.departments[1], this.departments[0]],
      levels: [this.academic_levels[0], this.academic_levels[1]],
      course_type: 'On Campus',
      is_active: true
    },
  ]

  course_reps: any = [
    {
      id: 1,
      first_name: 'Michael',
      other_names: 'Anin',
      last_name: 'Agyei',
      course_rep_id: 'TS01',
      photo: 'assets/user.png',
      gender: 'Male',
      notes: 'Some Notes',
      onboarding_date: '2024-12-02',
      is_deleted: false,
      departments: [this.departments[0]],
      courses: [this.courses[0]],
    },
    {
      id: 2,
      first_name: 'Prince',
      other_names: 'Nana',
      last_name: 'Amoako',
      course_rep_id: 'TS02',
      photo: 'assets/user.png',
      gender: 'Male',
      onboarding_date: '2024-12-02',
      is_deleted: false,
      departments: [this.departments[0]],
      courses: [this.courses[0]],
    },
    {
      id: 3,
      first_name: 'Eunice',
      other_names: 'Amarachi',
      last_name: 'Okonkwo',
      course_rep_id: 'TS02',
      photo: 'assets/user.png',
      gender: 'Male',
      notes: 'Some Notes',
      onboarding_date: '2024-12-02',
      is_deleted: false,
      departments: [this.departments[1]],
      courses: [this.courses[1]],
    },
    {
      id: 4,
      first_name: 'Robby',
      other_names: 'Appiah',
      last_name: 'Kubi',
      course_rep_id: 'TS02',
      photo: 'assets/user.png',
      gender: 'Male',
      onboarding_date: '2024-12-02',
      is_deleted: false,
      departments: [this.departments[1]],
      courses: [this.courses[1]],
    },
  ]

  calendars:any = [
    {
      id: 1,
      name: 'Calendar 2023',
      start_date: '2023-01-01',
      end_date: '2023-12-31',
      working_days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      selected_faculties: [this.faculties[0], this.faculties[1]],
      selected_departments: [this.departments[0], this.departments[1]],
      is_active: true
    }
  ]

  users: any = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'User',
      phone: '0243123456',
      gender: 'Male',
      is_active: true,
      user_role: 'super_admin',
      photo: 'assets/user.png',
      email: 'admin@gmail.com',
      departments: [this.departments[0]],
      courses: [this.courses[0]],
      is_deleted: false,
    },
    {
      id: 2,
      username: 'prince',
      password: 'prince123',
      first_name: 'Prince Paul',
      last_name: 'Frimpong',
      phone: '0243123456',
      gender: 'Male',
      is_active: false,
      user_role: 'lecturer',
      photo: 'assets/user.png',
      email: 'prince@gmail.com',
      faculty: this.faculties[1],
      departments: [this.departments[0]],
      courses: [this.courses[0]],
      is_deleted: false,
    },
    {
      id: 3,
      username: 'collins',
      password: 'collins123',
      first_name: 'Collins',
      last_name: 'Okyere',
      phone: '0243123456',
      gender: 'Male',
      is_active: true,
      user_role: 'admin',
      photo: 'assets/user.png',
      email: 'collins@gmail.com',
      faculty: this.faculties[1],
      departments: [this.departments[0]],
      courses: [this.courses[0]],
      is_deleted: false,
    },
    {
      id: 4,
      username: 'ekow',
      password: 'ekow123',
      first_name: 'Ekow',
      last_name: 'Klewiah',
      phone: '0243123456',
      gender: 'Male',
      is_active: false,
      user_role: 'admin',
      photo: 'assets/user.png',
      email: 'ekow@gmail.com',
      organisation: this.faculties[3],
      departments: [this.departments[0]],
      courses: [this.courses[0]],
      is_deleted: false,
    },
    {
      id: 5,
      username: 'eunice',
      password: 'eunice123',
      first_name: 'Eunice',
      last_name: 'Francis',
      phone: '0243123456',
      gender: 'Female',
      is_active: true,
      user_role: 'lecturer',
      status: 'Active',
      rating: 'Gold',
      photo: 'assets/user.png',
      email: 'eunice@gmail.com',
      departments: [this.departments[0]],
      courses: [this.courses[0]],
      is_deleted: false,
    },
    {
      id: 6,
      username: 'kofi',
      password: 'kofi123',
      first_name: 'Kofi',
      last_name: 'Owusu',
      phone: '0243123456',
      gender: 'Male',
      is_active: true,
      user_role: 'lecturer',
      status: 'Active',
      rating: 'Gold',
      photo: 'assets/user.png',
      email: 'kofi@gmail.com',
      departments: [this.departments[0]],
      courses: [this.courses[0]],
      is_deleted: false,
    },
    {
      id: 7,
      username: 'robby',
      password: 'robby123',
      first_name: 'Robby',
      last_name: 'Appiah',
      phone: '0243123456',
      gender: 'Male',
      is_active: true,
      user_role: 'course_rep',
      status: 'Active',
      rating: 'Gold',
      photo: 'assets/user.png',
      email: 'robby@gmail.com',
      sponsored_organisations: [this.faculties[0]],
      departments: [this.departments[0]],
      courses: [this.courses[0]],
      is_deleted: false,
    },
  ]

  lecturers: any = [
    {
      id: 1,
      username: 'eunice',
      password: 'eunice123',
      first_name: 'Eunice',
      last_name: 'Francis',
      phone: '0243123456',
      gender: 'Female',
      is_active: true,
      user_role: 'lecturer',
      status: 'Active',
      rating: 'Gold',
      photo: 'assets/user.png',
      email: 'eunice@gmail.com',
      departments: [this.departments[0]],
      courses: [this.courses[0]],
      is_deleted: false,
    },
    {
      id: 2,
      username: 'kofi',
      password: 'kofi123',
      first_name: 'Kofi',
      last_name: 'Owusu',
      phone: '0243123456',
      gender: 'Male',
      is_active: true,
      user_role: 'lecturer',
      status: 'Active',
      rating: 'Gold',
      photo: 'assets/user.png',
      email: 'kofi@gmail.com',
      departments: [this.departments[1]],
      courses: [this.courses[1]],
      is_deleted: false,
    },
    {
      id: 3,
      username: 'robby',
      password: 'robby123',
      first_name: 'Robby',
      last_name: 'Appiah',
      phone: '0243123456',
      gender: 'Male',
      is_active: true,
      user_role: 'lecturer',
      status: 'Active',
      rating: 'Gold',
      photo: 'assets/user.png',
      email: 'robby@gmail.com',
      departments: [this.departments[0]],
      courses: [this.courses[0]],
      is_deleted: false,
    },
  ]

  academic_timetables:any = [
    {
      id: 1,
      // name: 'Academic timetable 1',
      calendar: this.calendars[0],
      department: this.departments[0],
      academic_level: this.academic_levels[0],
      activities:[
        {
          day: 'Monday',
          course: this.courses[0],
          lecturer: this.lecturers[0],
          course_rep: this.course_reps[0],
          start_time: '08:00',
          end_time: '10:00',
        }
      ],
      is_active: true
    }
  ]

  reports: any[] = [
    { id: 'D001', date: '2025-08-01', time: '10:38', lecturer: this.lecturers[2], organisation: this.faculties[0], project: null, beneficiary: 'Michael Agyei', donationType: 'Cash', amount: 150, purpose: 'Donation', description: null, isAnonymous: false, target: 'organisation', status: 'Paid' },
    { id: 'D002', date: '2025-08-02', time: '11:00', lecturer: this.lecturers[1], faculty: this.faculties[1], project: { id:2, name:'Emergency Shelter' }, beneficiary: 'Eunice Okonkwo', donationType: 'In-Kind', amount: 0, purpose: 'Donation', description: 'Clothes', isAnonymous: true, target: 'project', status: 'Approved' },
    { id: 'D003', date: '2025-08-03', time: '12:15', lecturer: this.lecturers[2], faculty: this.faculties[1], project: { id:2, name:'Emergency Shelter' }, beneficiary: 'Eunice Okonkwo', donationType: 'In-Kind', amount: 0, purpose: 'Donation', description: 'School supplies', isAnonymous: false, target: 'project', status: 'Approved' },
    { id: 'D004', date: '2025-08-04', time: '14:22', lecturer: this.lecturers[2], organisation: this.faculties[0], project: null, beneficiary: 'Prince Amoako', donationType: 'Cash', amount: 80, purpose: 'Donation', description: null, isAnonymous: false, target: 'beneficiary', status: 'Pending' },
    { id: 'D005', date: '2025-07-28', time: '09:45', lecturer: this.lecturers[2], organisation: this.faculties[2], project: null, beneficiary: 'Robby Kubi', donationType: 'Cash', amount: 220, purpose: 'Donation', description: null, isAnonymous: false, target: 'organisation', status: 'Paid' },
    { id: 'D006', date: '2025-06-18', time: '13:10', lecturer: this.lecturers[2], faculty: this.faculties[1], project: null, beneficiary: 'Mary Ann', donationType: 'In-Kind', amount: 0, purpose: 'Donation', description: 'Clothes and shoes', isAnonymous: false, target: 'beneficiary', status: 'Paid' },
    { id: 'D007', date: '2025-08-05', time: '15:00', lecturer: this.lecturers[1], organisation: this.faculties[4], project: null, beneficiary: 'Lydia Mensah', donationType: 'Cash', amount: 300, purpose: 'Medical Aid', description: null, isAnonymous: false, target: 'beneficiary', status: 'Approved' },
    { id: 'D008', date: '2025-08-06', time: '10:00', lecturer: this.lecturers[1], organisation: this.faculties[3], project: { id:5, name:'School Rebuild' }, beneficiary: 'Samuel Yeboah', donationType: 'In-Kind', amount: 0, purpose: 'Education', description: 'Textbooks', isAnonymous: false, target: 'project', status: 'Approved' },
    { id: 'D009', date: '2025-08-07', time: '08:30', lecturer: this.lecturers[2], organisation: this.faculties[0], project: null, beneficiary: 'Aisha Bello', donationType: 'Cash', amount: 100, purpose: 'Emergency Relief', description: null, isAnonymous: false, target: 'organisation', status: 'Rejected' },
    { id: 'D010', date: '2025-08-08', time: '11:45', lecturer: this.lecturers[2], organisation: this.faculties[2], project: { id:6, name:'Clean Water Project' }, beneficiary: 'Joseph Mensah', donationType: 'In-Kind', amount: 0, purpose: 'Water Supply', description: 'Water containers', isAnonymous: false, target: 'project', status: 'Approved' },
    { id: 'D011', date: '2025-08-09', time: '16:30', lecturer: this.lecturers[2], faculty: this.faculties[1], project: null, beneficiary: 'Naomi Attah', donationType: 'Cash', amount: 50, purpose: 'Transport', description: null, isAnonymous: false, target: 'beneficiary', status: 'Pending' },
    { id: 'D012', date: '2025-08-10', time: '13:40', lecturer: this.lecturers[2], organisation: this.faculties[4], project: null, beneficiary: 'Kwame Owusu', donationType: 'Cash', amount: 200, purpose: 'Food Aid', description: null, isAnonymous: false, target: 'organisation', status: 'Paid' },
    { id: 'D013', date: '2025-08-11', time: '14:50', lecturer: this.lecturers[2], organisation: this.faculties[3], project: { id:5, name:'School Rebuild' }, beneficiary: 'Angela Ofori', donationType: 'In-Kind', amount: 0, purpose: 'Education', description: 'School uniforms', isAnonymous: false, target: 'project', status: 'Paid' },
    { id: 'D014', date: '2025-08-12', time: '09:20', lecturer: this.lecturers[2], faculty: this.faculties[1], project: null, beneficiary: 'Bernard Tetteh', donationType: 'Cash', amount: 75, purpose: 'Medical Assistance', description: null, isAnonymous: false, target: 'beneficiary', status: 'Approved' },
    { id: 'D015', date: '2025-08-13', time: '10:30', lecturer: this.lecturers[2], organisation: this.faculties[2], project: null, beneficiary: 'Rita Mensimah', donationType: 'Cash', amount: 130, purpose: 'Sanitation', description: null, isAnonymous: false, target: 'organisation', status: 'Pending' },
    { id: 'D016', date: '2025-08-14', time: '15:50', lecturer: this.lecturers[2], organisation: this.faculties[4], project: null, beneficiary: 'Eric Boateng', donationType: 'In-Kind', amount: 0, purpose: 'Nutrition', description: 'Food items', isAnonymous: false, target: 'beneficiary', status: 'Paid' },
    { id: 'D017', date: '2025-08-15', time: '16:00', lecturer: this.lecturers[1], organisation: this.faculties[3], project: { id:7, name:'Youth Skills Training' }, beneficiary: 'Kofi Nkrumah', donationType: 'In-Kind', amount: 0, purpose: 'Vocational', description: 'Tools and kits', isAnonymous: false, target: 'project', status: 'Approved' },
    { id: 'D018', date: '2025-08-16', time: '12:00', lecturer: this.lecturers[1], organisation: this.faculties[0], project: null, beneficiary: 'Sarah Johnson', donationType: 'Cash', amount: 180, purpose: 'Support', description: null, isAnonymous: false, target: 'beneficiary', status: 'Paid' },
    { id: 'D019', date: '2025-08-17', time: '10:10', lecturer: this.lecturers[2], organisation: this.faculties[2], project: { id:6, name:'Clean Water Project' }, beneficiary: 'Isaac Agyapong', donationType: 'In-Kind', amount: 0, purpose: 'Water Supply', description: 'Filters and buckets', isAnonymous: false, target: 'project', status: 'Approved' },
    { id: 'D020', date: '2025-08-18', time: '14:15', lecturer: this.lecturers[2], organisation: this.faculties[4], project: null, beneficiary: 'Blessing Okoro', donationType: 'Cash', amount: 90, purpose: 'Child Support', description: null, isAnonymous: false, target: 'beneficiary', status: 'Paid' },
  ]

  dashboardInfo = {
    lecturers: {
      total: 42,
      male: 30,
      female: 12,
    },
    lessons: {
      total: 140,
      attended: {
        count: 128,
        change: "+5 from last week",
        changeType: "increase" // or "decrease"
      },
      missed: {
        count: 12,
        status: "↓ Moderate"
      },
      swapped: {
        count: 6,
        status: "↑ Needs attention"
      },
      today: {
        total: 140,
        attended: { count: 128, percent: 91.45 },
        missed: { count: 12, percent: 8.57 },
        ongoing: { count: 6, percent: 4.29},
        pending: { count: 6, percent: 4.29},
      }
    },
    analytics: {
      attendanceTrends: [50, 75, 30, 60, 50, 80]
    },
    attendanceProgress: { percent: 70 },
    ongoingClass: {
      time: "01:15:32",
      lecturer: "Prof. Agyeman",
      subject: "ICT Lecture"
    },
    upcomingLessons: [
      {
        lecturer: "Prof. Agyeman",
        subject: "ICT Lecture",
        time: "2:00pm - 4:00pm",
      },
      {
        lecturer: "Dr. Mensah",
        subject: "Sociology Lecture",
        time: "Tomorrow 10:00am",
      }
    ],
    logs: [
      { message: "Prof. Agyeman attended class", date: "Today", type: "normal" },
      { message: "Dr. Mensah missed class", date: "Yesterday", type: "warning" },
      { message: "Prof. Owusu swapped class", date: "2 days ago", type: "info" }
    ],
    monitor: [
      // { name: "Prof. Agyeman", note: "Present in last 5 classes", status: "Active" },
      { name: "Dr. Mensah", note: "Missed 2 recent classes", status: "Warning" },
      { name: "Prof. Owusu", note: "Swapped 2 class", status: "Moderate" },
    ]
  };

  constructor() {}

}
