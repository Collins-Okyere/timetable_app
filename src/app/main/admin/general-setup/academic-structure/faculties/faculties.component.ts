import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartTableComponent } from '../../../../../shared/reusable-components/smart-table/smart-table.component';
import { ApiService } from '../../../../../shared/services/api.service';

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule, SmartTableComponent],
  templateUrl: './faculties.component.html',
  styleUrl: './faculties.component.css'
})
export class FacultiesComponent implements OnInit {

  tableData:any
  fetchedData:any

  constructor(private api: ApiService){}

  async ngOnInit(){
    const neededData:any = ['faculties'];
    this.fetchedData = await this.api.fetchData(neededData);
    if(this.fetchedData?.faculties){
      this.tableData = {
        title: 'Faculties',
        subTitle: '',
        tag: 'Faculty',
        description: 'List of faculties',
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
        sortBy: 'name',
        allowGlobalSearch: true,
        allowColumnSearch: true,
        allowDownload: true,
        allowEdit: true,
        allowDelete: true,
        allowSorting: true,
        dataSet: this.fetchedData?.faculties,
        formFields: [
          { field: 'name', type: 'input', required: true },
          { field: 'code', type: 'input', required: true },
        ],
        tableFields: ['name', 'code'],
        path: 'faculties',
        objs: 'faculties',
        type: 'general',        
      }
    }
  }
    
}