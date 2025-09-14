import { Component, OnInit } from '@angular/core';
import { TabsComponent } from '../../../../shared/reusable-components/tabs/tabs.component';
import { CalendarsComponent } from "./calendars/calendars.component";
import { TimetablesComponent } from "./timetables/timetables.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-and-timetable',
  standalone: true,
  imports: [TabsComponent, CalendarsComponent, TimetablesComponent, CommonModule],
  templateUrl: './calendar-and-timetable.component.html',
  styleUrl: './calendar-and-timetable.component.css'
})
export class CalendarAndTimetableComponent  implements OnInit {

  page: number = 1;
  tabsData = {
    tabs: [
      {
        title: 'Calendars',
        description: 'eg. 1st Semester 2022/2023'
      },
      {
        title: 'Timetable',
        description: 'eg. 1st Semester 2022/2023'
      }
    ],
    page: 1
  };

  constructor() {}

  ngOnInit(){
    this.switchForm(this.page);
  }

  async switchForm(page: number){
    this.page = page;
    this.tabsData = { ...this.tabsData, page: page };
  }

}
