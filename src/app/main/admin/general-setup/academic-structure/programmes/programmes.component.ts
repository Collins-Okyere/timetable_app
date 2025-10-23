import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../shared/services/api.service';
import { SmartTableComponent } from '../../../../../shared/reusable-components/smart-table/smart-table.component';

@Component({
  selector: 'app-programmes',
  standalone: true,
  imports: [SmartTableComponent],
  templateUrl: './programmes.component.html',
  styleUrl: './programmes.component.css'
})
export class ProgrammesComponent implements OnInit {

  tableData:any

  constructor(private api: ApiService){}

  ngOnInit(){
    this.api.makeRequest('GET', 'general_settings', { action_type: 'get_programs' }).then(async (data: any) => {
        if(data?.programs){
          this.tableData = {
            title: 'Programmes',
            subTitle: '',
            tag: 'Program',
            description: 'List of programmes',
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
            dataSet: data?.programs,
            formFields: [
              { field: 'course_name', type: 'input', required: true },
              { field: 'code', type: 'input', required: true },
              { field: 'faculty_department', type: 'select', placeholder: 'Select Department', displayProperty: 'name', list: data?.departments, required: true },
            ],
            tableFields: ['course_name', 'code', 'faculty_department'],
            path: 'general_settings',
            objs: 'programs',
            type: 'general',        
          }
        }
      
    })
    
  }
    
}