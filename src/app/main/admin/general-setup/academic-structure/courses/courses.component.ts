import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../shared/services/api.service';
import { SmartTableComponent } from '../../../../../shared/reusable-components/smart-table/smart-table.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [SmartTableComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {

  tableData:any

  constructor(private api: ApiService){}

  ngOnInit(){
    this.api.makeRequest('GET', 'general_settings', { action_type: 'get_courses' }).then(async (data: any) => {
        if(data?.courses){
 for (const course of data.courses) {
  if (typeof course.level_names === 'string') {
    course.level_names = course.level_names.split(',').map((name:any) => name.trim());
  }

  if (typeof course.department_names === 'string') {
    course.department_names = course.department_names.split(',').map((name:any) => name.trim());
  }
}

          this.tableData = {
            title: 'Courses',
            subTitle: '',
            tag: 'course',
            description: 'List of courses',
            allowAdd: true,
            pageSize: 20,
            sortBy: 'name',
            allowGlobalSearch: true,
            allowColumnSearch: true,
            allowDownload: true,
            allowMenu: true,
            allowEdit: true,
            allowDelete: true,
            allowSorting: true,
            dataSet: data?.courses,
            formFields: [
              { field: 'name', type: 'input', required: true },
              { field: 'code', type: 'input', required: true },
              { field: 'level_names', type: 'select', placeholder: 'Select Levels', displayProperty: 'name', list: data?.levels, multiple: true, required: true },
              { field: 'department_names', type: 'select', placeholder: 'Select Departments', displayProperty: 'name', list: data?.departments, multiple: true, required: true },
              { field: 'course_type', type: 'select', placeholder: 'Select Type', displayProperty: 'name', list: ['On Campus', 'Off Campus'], required: true },
            ],
            tableFields: ['name', 'code', 'level_names', 'department_names', 'course_type'],
            path: 'general_settings',
            objs: 'courses',
            type: 'general',        
          }
        }
      
    })
    
  }

  

  // tableData:any
  // fetchedData:any

  // constructor(private api: ApiService){}

  // async ngOnInit(){
  //   const neededData:any = ['courses','departments', 'academicLevels'];
  //   this.fetchedData = await this.api.fetchData(neededData);
  //   if(this.fetchedData?.courses){
  //     this.tableData = {
  //       title: 'Courses',
  //       subTitle: '',
  //       tag: 'Course',
  //       description: 'List of courses',
  //       allowAdd: true,
  //       sortBy: 'name',
  //       neededData: neededData,
  //       allowStatCards: true,
  //       pageSize: 15,
  //       stats: {
  //         defaults: ['count', 'active', 'new'],
  //         special: []
  //       },
  //       allowGlobalSearch: true,
  //       allowColumnSearch: true,
  //       allowDownload: true,
  //       allowMenu: true,
  //       allowEdit: true,
  //       allowDelete: true,
  //       allowSorting: true,
  //       dataSet: this.fetchedData?.courses,
  //       formFields: [
  //         { field: 'name', type: 'input', required: true, stretch: true },
  //         { field: 'code', type: 'input', required: true, stretch: true },
  //         { field: 'levels', type: 'select', placeholder: 'Select Academic Levels', displayProperty: 'name', list: this.fetchedData?.academicLevels, multiple: true, required: true, stretch: true },
  //         { field: 'departments', type: 'select', placeholder: 'Select Departments', displayProperty: 'name', list: this.fetchedData?.departments, multiple: true, required: true, stretch: true },
  //         { field: 'course_type', type: 'select', placeholder: 'Select Type', displayProperty: 'name', list: ['On Campus', 'Off Campus'], required: true, stretch: true },
  //       ],
  //       tableFields: ['name', 'code', 'levels', 'departments', 'courseType'],
  //       path: 'courses',
  //       objs: 'courses',
  //       type: 'general',        
  //     }
  //   }
  // }
    
}