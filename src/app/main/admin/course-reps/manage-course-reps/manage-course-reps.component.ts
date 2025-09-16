import { Component } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { SmartTableComponent } from '../../../../shared/reusable-components/smart-table/smart-table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-course-reps',
  imports: [CommonModule, SmartTableComponent],
  standalone: true,
  templateUrl: './manage-course-reps.component.html',
  styleUrl: './manage-course-reps.component.css'
})
export class ManageCourseRepsComponent {

  course_reps: any = [];
  sendObj: any
  tableData:any
  fetchedData:any
  neededData:any

  constructor(private api: ApiService){}

  async ngOnInit(){ 
    this.neededData = ['faculties','courses','course_reps','departments']
    this.fetchedData = await this.api.fetchData(this.neededData)
    this.course_reps = this.fetchedData?.course_reps
    this.setTable()   
  }

  async setTable(){
    this.tableData = {
      title: 'Course Reps',
      subTitle: '',
      tag: 'Course Rep',
      description: 'List of Course Reps',
      allowAdd: true,
      neededData: this.neededData,
      sortBy: "first_name",
      allowStatCards: true,
      pageSize: 15,
      stats: {
        defaults: ['count', 'gender', 'active', 'new'],
        special: []
      },
      isMultiPart: false,
      allowGlobalSearch: true,
      allowColumnSearch: true,
      allowDownload: true,
      allowMenu: true,
allowEdit: true,
      allowDelete: true,
      allowSorting: true,
      dataSet: this.course_reps,
      formFields: [
        { field: "user_id", type: "input",  required: true, placeholder: 'User ID', disabled: true },
        { field: "first_name", type: "input",  required: true, placeholder: 'Enter First Name'},
        { field: "last_name", type: "input", placeholder: 'Enter Last Name'},
        { field: "other_names", type: "input", placeholder: 'Enter Other Names'},
        { field: "phone", type: "input", placeholder: 'Phone'},     
        { field: "email", type: "input", placeholder: 'Email'},     
        { field: "gender", type: "select", list: ['Male', 'Female'], required: true },
        { field: "faculty", type: "select", list: this.fetchedData?.faculties, required: true },
        { field: "department", type: "select", list: this.fetchedData?.departments, required: true },
        { field: "courses", type: "select", list: this.fetchedData?.courses, multiple: true, autoClose: false, required: true },
      ],
      tableFields: ["user", "faculty", "department", "courses"],
      path: 'course_reps',
      objs: 'course_reps',
      type: 'general',        
    }
  }


}
