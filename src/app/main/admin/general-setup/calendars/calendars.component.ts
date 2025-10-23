import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SmartTableComponent } from '../../../../shared/reusable-components/smart-table/smart-table.component';
import { ApiService } from '../../../../shared/services/api.service';
@Component({
  selector: 'app-calendars',
  standalone: true,
  imports: [CommonModule, FormsModule, SmartTableComponent],
  templateUrl: './calendars.component.html',
  styleUrls: ['./calendars.component.scss'],
})
export class CalendarsComponent implements OnInit { 

  addNew:boolean = false
  calendars: any = [];
  sendObj: any
  tableData:any
  fetchedData:any
  neededData:any

  constructor(private api: ApiService){}

  async ngOnInit(){ 
    this.neededData = ['calendars', 'faculties', 'departments'];
    this.fetchedData = await this.api.fetchData(this.neededData);
    this.calendars = this.fetchedData?.calendars
    this.setTable()   
  }

  async setTable(){
    this.tableData = {
      title: 'Academic Calendars',
      subTitle: '',
      tag: 'Calendar',
      description: 'List of Academic calendars',
      allowAdd: true,
      neededData: this.neededData,
      sortBy: "start_date",
      allowStatCards: true,
      pageSize: 15,
      stats: {
        defaults: ['count', 'active', 'new'],
        special: []
      },
      allowGlobalSearch: true,
      allowColumnSearch: true,
      allowDownload: true,
      allowMenu: true,
allowEdit: true,
      allowApproval: true,
      allowDelete: true,
      allowSorting: true,
      dataSet: this.calendars,
      formFields: [
        { field: "name", type: "input",  required: true, placeholder: 'eg. 1st Semester 2024', stretch: true },
        { field: "start_date", type: "date", required: true },
        { field: "end_date", type: "date", required: true },        
        { field: "selected_faculties", type: "select", stretch: true, list: this.fetchedData.faculties, required: true, multiple: true, autoClose: false },
        { field: "selected_departments", stretch: true, type: "select", list: this.fetchedData.departments, required: true, multiple: true, autoClose: false },
        { field: "working_days", type: "select", stretch: true, list: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true, multiple: true, autoClose: false },
      ],
      tableFields: ["name", "start_date", "end_date"],
      path: 'calendars',
      objs: 'calendars',
      type: 'general',        
    }
  }

  addCalendar() {    
    this.addNew = !this.addNew;
    this.sendObj = { schedule: null }
  }

  editCalendar(obj: any) {
    const index = this.calendars.indexOf(obj);
    this.addNew = true
    this.sendObj = { schedule: obj, updating: true}
    if (index !== -1) {
      this.calendars[index] = { ...this.calendars[index], ...obj };
    }
  }

  deleteCalendar(obj: any) {
    const index = this.calendars.indexOf(obj);
    if (index !== -1) {
      this.calendars.splice(index, 1);
    }
  }

}
