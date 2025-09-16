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
  fetchedData:any

  constructor(private api: ApiService){}

  async ngOnInit(){
    const neededData:any = ['courses','departments', 'academic_levels'];
    this.fetchedData = await this.api.fetchData(neededData);
    if(this.fetchedData?.courses){
      this.tableData = {
        title: 'Courses',
        subTitle: '',
        tag: 'Course',
        description: 'List of courses',
        allowAdd: true,
        sortBy: 'name',
        neededData: neededData,
        allowStatCards: true,
        pageSize: 15,
        stats: {
          defaults: ['count', 'active', 'new'],
          special: []
        },
        allowGlobalSearch: true,
        allowColumnSearch: true,
        allowDownload: true,
        allowMenu: true,
allowEdit: true,
        allowDelete: true,
        allowSorting: true,
        dataSet: this.fetchedData?.courses,
        formFields: [
          { field: 'name', type: 'input', required: true, stretch: true },
          { field: 'code', type: 'input', required: true, stretch: true },
          { field: 'levels', type: 'select', placeholder: 'Select Academic Levels', displayProperty: 'name', list: this.fetchedData?.academic_levels, multiple: true, required: true, stretch: true },
          { field: 'departments', type: 'select', placeholder: 'Select Departments', displayProperty: 'name', list: this.fetchedData?.departments, multiple: true, required: true, stretch: true },
          { field: 'course_type', type: 'select', placeholder: 'Select Type', displayProperty: 'name', list: ['On Campus', 'Off Campus'], required: true, stretch: true },
        ],
        tableFields: ['name', 'code', 'levels', 'departments', 'course_type'],
        path: 'courses',
        objs: 'courses',
        type: 'general',        
      }
    }
    console.log(this.fetchedData?.courses)
  }
    
}