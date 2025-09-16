import { Component } from '@angular/core';
import { SmartTableComponent } from '../../../shared/reusable-components/smart-table/smart-table.component';
import { ApiService } from '../../../shared/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timetable',
  imports: [CommonModule, SmartTableComponent],
  standalone: true,
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.css'
})
export class TimetableComponent {

  timetables: any = [];
  sendObj: any
  tableData:any
  fetchedData:any
  neededData:any
  currUser:any
  constructor(private api: ApiService){}

  async ngOnInit(){ 
    this.currUser = this.api.safeJSONParse('currUser')
    this.neededData = ['timetables', 'lecturers', 'reports']
    this.fetchedData = await this.api.fetchData(this.neededData)
    this.timetables = this.fetchedData?.timetables
    this.setTable()   
  }

  async setTable(){
    const tableFields:any = this.currUser?.user_role === 'lecturer' ? [  "start_time", "end_time", "course", "level", "status"] : ["start_time", "end_time", "course", "lecturer", "status"]
    const swap:any = this.currUser.user_role === 'course_rep' ? false : true
    this.tableData = {
      title: 'Classes' ,
      subTitle: 'Today',
      tag: 'Classes',
      description: "Today's Timetable",
      neededData: this.neededData,
      sortBy: "day",
      allowStatCards: true,
      allowSwap: swap,
      pageSize: 15,
      stats: {
        defaults: ['count', 'pending', 'completed', 'missed', 'swapped',],
        special: []
      },
      allowGlobalSearch: true,
      allowColumnSearch: true,
      allowDownload: true,
      allowMenu: true,
      allowSorting: true,
      dataSet: this.fetchedData?.timetables,
      formFields: [
        { field: "user_id", type: "input",  required: true, placeholder: 'User ID', disabled: true },
        { field: "first_name", type: "input",  required: true, placeholder: 'Enter First Name'},
        { field: "last_name", type: "input", placeholder: 'Enter Last Name'},
        { field: "other_names", type: "input", placeholder: 'Enter Other Names'},
        { field: "phone", type: "input", placeholder: 'Phone'},     
        { field: "email", type: "input", placeholder: 'Email'},     
        { field: "gender", type: "select", list: ['Male', 'Female'], required: true },
        { field: "faculties", type: "select", list: this.fetchedData?.faculties, multiple: true, autoClose: false, required: true },
        { field: "departments", type: "select", list: this.fetchedData?.departments, multiple: true, autoClose: false, required: true },
        { field: "courses", type: "select", list: this.fetchedData?.courses, multiple: true, autoClose: false, required: true },
      ],
      tableFields: tableFields,
      path: 'timetables',
      objs: 'timetables',
      type: 'general',        
    }
  }


}
