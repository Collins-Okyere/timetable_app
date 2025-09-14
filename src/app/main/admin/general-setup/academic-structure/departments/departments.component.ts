import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../shared/services/api.service';
import { SmartTableComponent } from '../../../../../shared/reusable-components/smart-table/smart-table.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [SmartTableComponent],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {

  tableData:any
  fetchedData:any

  constructor(private api: ApiService){}

  async ngOnInit(){
    const neededData:any = ['departments','faculties'];
    this.fetchedData = await this.api.fetchData(neededData);
    if(this.fetchedData?.departments){
      this.tableData = {
        title: 'Departments',
        subTitle: '',
        tag: 'Department',
        description: 'List of departments',
        allowAdd: true,
        allowFilters: false,
        filters: {
          neededData: [...neededData],
          filterBy: []
        },
        allowStatCards: true,
        pageSize: 15,
        stats: {
          defaults: ['count', 'active', 'new'],
          special: []
        },
        allowGlobalSearch: true,
        allowColumnSearch: true,
        allowDownload: true,
        allowEdit: true,
        allowDelete: true,
        allowSorting: true,
        dataSet: this.fetchedData?.departments,
        formFields: [
          { field: 'name', type: 'input', required: true },
          { field: 'code', type: 'input', required: true },
          { field: 'faculty', type: 'select', placeholder: 'Select Faculty', displayProperty: 'name', list: this.fetchedData?.faculties, required: true },
        ],
        tableFields: ['name', 'code', 'faculty' ],
        path: 'departments',
        objs: 'departments',
        type: 'general',        
      }
    }
    console.log(this.fetchedData?.departments)
  }
    
}