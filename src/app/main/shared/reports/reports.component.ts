import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { SmartTableComponent } from '../../../shared/reusable-components/smart-table/smart-table.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, SmartTableComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {

  currUser:any
  reports: any = [];
  tableData:any
  fetchedData:any
  neededData:any

  constructor(private api: ApiService){}

  async ngOnInit(){ 
    this.currUser = this.api.safeJSONParse('currUser')
    this.neededData = ['reports']
    this.fetchedData = await this.api.fetchData(this.neededData)
    this.reports = this.fetchedData?.reports
    this.setTable()   
  }

  async setTable(){
    const tableFields:any = this.currUser?.user_role === 'lecturer' ? ["date", "start_time", "end_time", "course", "level", "status"] : ["date", "start_time", "end_time", "course", "level", "lecturer", "status"]
    this.tableData = {
      title: 'Reports',
      tag: 'Lectures',
      description: 'Lecture Reports',
      neededData: this.neededData,
      sortBy: "date",
      allowStatCards: true,
      pageSize: 15,
      stats: {
        defaults: ['count','completed','missed','pending'],
        special: []
      },
      allowGlobalSearch: true,
      allowColumnSearch: true,
      allowDownload: true,
      allowSorting: true,
      dataSet: this.reports,
      formFields: [],
      tableFields: tableFields,
      type: 'general',        
    }
  }

}