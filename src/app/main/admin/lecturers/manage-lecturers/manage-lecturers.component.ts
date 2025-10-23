import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { SmartTableComponent } from '../../../../shared/reusable-components/smart-table/smart-table.component';

@Component({
  selector: 'app-manage-lecturers',
  standalone: true,
  imports: [CommonModule, SmartTableComponent],
  providers: [DatePipe],
  templateUrl: './manage-lecturers.component.html',
  styleUrl: './manage-lecturers.component.css'
})
export class ManageLecturersComponent implements OnInit {

  lecturers: any = [];
  sendObj: any
  tableData:any
  fetchedData:any
  neededData:any

  constructor(private api: ApiService){}

  async ngOnInit(){ 
    this.neededData = ['faculties','courses','lecturers','departments']
    this.fetchedData = await this.api.fetchData(this.neededData)
    this.lecturers = this.fetchedData?.lecturers
    this.setTable()   
  }

  async setTable(){
    this.tableData = {
      title: 'Lecturers',
      subTitle: '',
      tag: 'Lecturer',
      description: 'List of Lecturers',
      allowAdd: true,
      neededData: this.neededData,
      sortBy: "firstName",
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
      dataSet: this.lecturers,
      formFields: [
        { field: "userId", type: "input",  required: true, placeholder: 'User ID', disabled: true },
        { field: "firstName", type: "input",  required: true, placeholder: 'Enter First Name'},
        { field: "lastName", type: "input", placeholder: 'Enter Last Name'},
        { field: "otherNames", type: "input", placeholder: 'Enter Other Names'},
        { field: "phone", type: "input", placeholder: 'Phone'},     
        { field: "email", type: "input", placeholder: 'Email'},     
        { field: "gender", type: "select", list: ['Male', 'Female'], required: true },
        { field: "faculties", type: "select", list: this.fetchedData?.faculties, multiple: true, autoClose: false, required: true },
        { field: "departments", type: "select", list: this.fetchedData?.departments, multiple: true, autoClose: false, required: true },
        { field: "courses", type: "select", list: this.fetchedData?.courses, multiple: true, autoClose: false, required: true },
      ],
      tableFields: ["user", "faculties", "departments", "courses"],
      path: 'lecturers',
      objs: 'lecturers',
      type: 'general',        
    }
  }

}