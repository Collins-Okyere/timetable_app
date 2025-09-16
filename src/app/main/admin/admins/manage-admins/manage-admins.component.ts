import { Component } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { SmartTableComponent } from '../../../../shared/reusable-components/smart-table/smart-table.component';

@Component({
  selector: 'app-manage-admins',
  standalone: true,
  imports: [CommonModule, SmartTableComponent],
  providers: [DatePipe],
  templateUrl: './manage-admins.component.html',
  styleUrl: './manage-admins.component.css'
})
export class ManageAdminsComponent {

  admins: any = [];
  tableData:any
  fetchedData:any
  neededData:any

  constructor(private api: ApiService){}

  async ngOnInit(){ 
    this.neededData = ['admins'];
    this.fetchedData = await this.api.fetchData(this.neededData)
    this.admins = this.fetchedData?.admins
    this.setTable()   
  }

  async setTable(){
    this.tableData = {
      title: 'Admins',
      subTitle: '',
      tag: 'Admin',
      description: 'List of Admins',
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
      dataSet: this.admins,
      formFields: [
        { field: "user_id", type: "input",  required: true, placeholder: 'User ID', disabled: true },
        { field: "first_name", type: "input",  required: true, placeholder: 'Enter First Name'},
        { field: "last_name", type: "input", placeholder: 'Enter Last Name'},
        { field: "other_names", type: "input", placeholder: 'Enter Other Names'},
        { field: "phone", type: "input", placeholder: 'Phone'},     
        { field: "email", type: "input", placeholder: 'Email'},     
        { field: "gender", type: "select", list: ['Male', 'Female'], required: true },
        { field: "user_role", type: "select", list: ['admin'], required: true, defaultValue: 'admin' },
      ],
      tableFields: ["user", "email", "phone", "user_role"],
      path: 'admins',
      objs: 'admins',
      type: 'general',        
    }
  }
}
