import { Component, OnInit } from '@angular/core';
import { SmartTableComponent } from '../../../../../shared/reusable-components/smart-table/smart-table.component';
import { ApiService } from '../../../../../shared/services/api.service';

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [SmartTableComponent],
  templateUrl: './faculties.component.html',
  styleUrl: './faculties.component.css'
})
export class FacultiesComponent implements OnInit {

  tableData:any

  constructor(private api: ApiService){}

  ngOnInit(){
    this.api.makeRequest('GET', 'general_settings', { action_type: 'get_faculties' }).then(async (data: any) => {
        if(data?.faculties){
          this.tableData = {
            title: 'Faculties',
            subTitle: '',
            tag: 'Faculty',
            description: 'List of faculties',
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
            dataSet: data?.faculties,
            formFields: [
              { field: 'name', type: 'input', required: true },
              { field: 'code', type: 'input', required: true },
            ],
            tableFields: ['name', 'code'],
            path: 'general_settings',
            objs: 'faculties',
            type: 'general',        
          }
        }
    })
    
  }
    
}