import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SmartTableComponent } from '../../../../shared/reusable-components/smart-table/smart-table.component';
import { ApiService } from '../../../../shared/services/api.service';
@Component({
  selector: 'app-timetables',
  standalone: true,
  imports: [CommonModule, FormsModule, SmartTableComponent],
  templateUrl: './timetables.component.html',
  styleUrls: ['./timetables.component.scss'],
})
export class TimetablesComponent implements OnInit { 

  addNew:boolean = false
  timetables: any = [];
  sendObj: any
  tableData:any
  fetchedData:any
  neededData:any

  constructor(private api: ApiService){}

  async ngOnInit(){ 
    this.neededData = ['academicTimetables', 'courses', 'academicLevels', 'lecturers', 'departments', 'calendars', 'courseReps'];
    this.fetchedData = await this.api.fetchData(this.neededData);
    this.timetables = this.fetchedData?.academicTimetables
    this.setTable()   
  }

  async setTable(){
    this.tableData = {
      title: 'Academic Timetables',
      subTitle: '',
      tag: 'Timetable',
      description: 'List of Academic timetables',
      allowAdd: true,
      sortBy: "name",
      allowStatCards: true,
      pageSize: 15,
      stats: {
        defaults: ['count', 'active', 'new'],
        special: []
      },
      neededData: this.neededData,
      allowGlobalSearch: true,
      allowColumnSearch: true,
      allowDownload: true,
      allowMenu: true,
      allowEdit: true,
      allowApproval: true,
      allowDelete: true,
      allowSorting: true,
      dataSet: this.timetables,
      isMultiPart: true,
      formFields: [
        // { field: "name", stretch: true, type: "input", required: true },
        { field: "department", stretch: true, type: "select", list: this.fetchedData?.departments, required: true },
        { field: "calendar", stretch: true, type: "select", list: this.fetchedData?.calendars, required: true },
        { field: "academicLevel", stretch: true, type: "select", list: this.fetchedData?.academicLevels, required: true },
        // { field: "event.day", type: "select", stretch: true, list: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true, page2: true},
        // { field: "event.course", stretch: true, type: "select", list: this.fetchedData?.courses, required: true, page2: true },
        // { field: "event.startTime", type: "time", required: true, page2: true },
        // { field: "event.endTime", type: "time", required: true, page2: true },    

      ],
      tableFields: ["department", "calendar", "academicLevel"],
      path: 'academicTimetables',
      objs: 'academicTimetables',
      type: 'general',        
    }
  }

  addTimetables() {    
    this.addNew = !this.addNew;
    this.sendObj = { schedule: null }
  }

  editTimetables(obj: any) {
    const index = this.timetables.indexOf(obj);
    this.addNew = true
    this.sendObj = { schedule: obj, updating: true}
    if (index !== -1) {
      this.timetables[index] = { ...this.timetables[index], ...obj };
    }
  }

  deleteTimetables(obj: any) {
    const index = this.timetables.indexOf(obj);
    if (index !== -1) {
      this.timetables.splice(index, 1);
    }
  }

}
