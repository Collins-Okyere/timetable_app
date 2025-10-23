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

  sendObj: any
  tableData:any
  fetchedData:any

  constructor(private api: ApiService){}

  async ngOnInit(){ 
    await this.api.makeRequest('GET', 'students', { action_type: 'get_students' }).then(async (data: any) => {
      if(data){
        this.fetchedData = data;
        this.setTable()   
      }
    })
  }

  setTable(){
    this.tableData = {
      title: 'Students',
      subTitle: '',
      tag: 'Student',
      description: 'List of Students',
      allowAdd: true,
      // neededData: this.neededData,
      sortBy: "full_name",
      // allowStatCards: true,
      pageSize: 15,
      // stats: {
      //   defaults: ['count', 'gender', 'active', 'new'],
      //   special: []
      // },
      // isMultiPart: false,
      allowGlobalSearch: true,
      allowColumnSearch: true,
      // allowDownload: true,
      allowMenu: true,
      allowEdit: true,
      allowDelete: true,
      allowSorting: true,
      dataSet: this.fetchedData?.students,
      formFields: [
        { field: "admission_no", type: "input", value: this.fetchedData?.next_student_admission_no,  required: true, placeholder: 'Admission Number', disabled: true },
        { field: "first_name", type: "input",  required: true, placeholder: 'Enter First Name'},
        { field: "last_name", type: "input", placeholder: 'Enter Last Name'},
        { field: "middle_name", type: "input", placeholder: 'Enter Other Names'},
        { field: "mobile_no", type: "input", placeholder: 'Enter Phone'},     
        { field: "email", type: "input", placeholder: 'Enter Email'},     
        { field: "gender", type: "select", list: ['Male', 'Female'], required: true },
        { field: "level_name", type: "select", list: this.fetchedData?.levels, required: true },
        { field: "program_name", type: "select", list: this.fetchedData?.programs, displayProperty: 'course_name', required: true },
      ],
      tableFields: ["full_name", "gender", "mobile_no", "level_name", "program_name", ],
      path: 'students',
      objs: 'students',
      type: 'user_list',        
    }
  }


}
