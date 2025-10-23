import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTableComponent } from '../../../../../shared/reusable-components/smart-table/smart-table.component';
import { ApiService } from '../../../../../shared/services/api.service';

@Component({
  selector: 'app-academic-levels',
  standalone: true,
  imports: [CommonModule, SmartTableComponent],
  templateUrl: './academic-levels.component.html',
  styleUrl: './academic-levels.component.css'
})
export class AcademicLevelsComponent implements OnInit {

  tableData:any

  constructor(private api: ApiService){}

  ngOnInit(){
    this.api.makeRequest('GET', 'general_settings', { action_type: 'get_levels' }).then(async (data: any) => {
        if(data?.levels){
          this.tableData = {
            title: 'Academic Levels',
            subTitle: '',
            tag: 'Level',
            description: 'List of Academic Levels',
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
            dataSet: data?.levels,
            formFields: [
              { field: 'name', type: 'input', required: true },
              { field: 'code', type: 'input', required: true },
            ],
            tableFields: ['name', 'code'],
            path: 'general_settings',
            objs: 'levels',
            type: 'general',        
          }
        }
    }) 
  }
    
}