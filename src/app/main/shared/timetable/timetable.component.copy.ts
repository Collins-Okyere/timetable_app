import { Component } from '@angular/core';
import { SmartTableComponent } from '../../../shared/reusable-components/smart-table/smart-table.component';
import { ApiService } from '../../../shared/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timetable',
  imports: [CommonModule, SmartTableComponent],
  standalone: true,
  templateUrl: './timetable.component.copy.html',
  styleUrl: './timetable.component.css'
})
export class TimetableCopyComponent {

  timetables: any = [];
  sendObj: any
  tableData:any
  fetchedData:any
  neededData:any
  currUser:any
  constructor(private api: ApiService){}

  async ngOnInit(){ 
    this.currUser = this.api.safeJSONParse('currUser')
    this.neededData = ['timetables', 'lecturers', 'reports']
    this.fetchedData = await this.api.fetchData(this.neededData)
    this.timetables = this.fetchedData?.timetables
    this.setTable()   
  }

  async setTable(){
    const tableFields:any = [ "startTime", "endTime", "course", "level" ]
    const swap:any = this.currUser.userRole === 'courseRep' ? false : true
    const formFields:any = [
      { field: "date", type: "date",  required: true },
      { field: "course", type: "select", list: this.fetchedData?.courses, required: true },
      { field: "startTime", type: "time",  required: true},
      { field: "endTime", type: "time",  required: true},
      { field: "level", type: "select", list: this.fetchedData?.academicLevels, required: true },
    ]
    if(this.currUser?.userRole === 'courseRep' || this.currUser?.userRole.includes('admin')){
      tableFields.push("lecturer", "status")
    }else{
      tableFields.push("status");
      formFields.push({ field: "lecturer", type: "select", list: this.fetchedData?.lecturers, displayValue: 'fullName', required: true })
    }
    this.tableData = {
      title: 'Classes' ,
      subTitle: 'Today',
      tag: 'Classes',
      description: "Today's Timetable",
      neededData: this.neededData,
      sortBy: "day",
      allowStatCards: true,
      allowSwapping: swap,
      pageSize: 15,
      stats: {
        defaults: ['count', 'pending', 'completed', 'missed', 'swapped',],
        special: []
      },
      allowGlobalSearch: true,
      allowColumnSearch: true,
      allowDownload: true,
      allowMenu: true,
      allowSorting: true,
      dataSet: this.fetchedData?.timetables,
      formFields: formFields,
      tableFields: tableFields,
      path: 'timetables',
      objs: 'timetables',
      type: 'general',        
    }
  }


}
