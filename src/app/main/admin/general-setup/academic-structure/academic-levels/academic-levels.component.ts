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
  fetchedData:any

  constructor(private api: ApiService){}

  async ngOnInit(){
    const neededData:any = ['academic_levels'];
    this.fetchedData = await this.api.fetchData(neededData);
    if(this.fetchedData?.academic_levels){
      this.tableData = {
        title: 'Academic Levels',
        subTitle: '',
        tag: 'Level',
        description: 'List of academic levels',
        allowAdd: true,
        neededData: neededData,
        allowStatCards: true,
        pageSize: 15,
        stats: {
          defaults: ['count', 'active', 'new'],
          special: []
        },
        sortBy: 'name',
        allowGlobalSearch: true,
        allowColumnSearch: true,
        allowDownload: true,
        allowEdit: true,
        allowDelete: true,
        allowSorting: true,
        dataSet: this.fetchedData?.academic_levels,
        formFields: [
          { field: 'name', type: 'input', required: true },
          { field: 'code', type: 'input', required: true },
        ],
        tableFields: ['name', 'code'],
        path: 'academic_levels',
        objs: 'academic_levels',
        type: 'general',        
      }
    }
  }
    
}