import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TabsComponent } from '../../../../shared/reusable-components/tabs/tabs.component';
import { FacultiesComponent } from './faculties/faculties.component';
import { DepartmentsComponent } from './departments/departments.component';
import { CoursesComponent } from './courses/courses.component';
import { ApiService } from '../../../../shared/services/api.service';
import { AcademicLevelsComponent } from "./academic-levels/academic-levels.component";

@Component({
  selector: 'app-academic-structure',
  standalone: true,
  imports: [TabsComponent, CommonModule, FacultiesComponent, DepartmentsComponent, CoursesComponent, AcademicLevelsComponent],
  templateUrl: './academic-structure.component.html',
  styleUrl: './academic-structure.component.css'
})
export class AcademicStructureComponent implements OnInit {

  page: number = 1;
  tabsData = {
    tabs: [
      {
        title: 'Faculties',
        description: 'eg. Humanities'
      },
      {
        title: 'Departments',
        description: 'eg. Dept. Of Sociology'
      },
      {
        title: 'Academic Levels',
        description: 'eg. Level 100'
      },
      {
        title: 'Courses',
        description: "eg. Intro. to Sociology"
      }
    ],
    page: 1
  };

  constructor(private readonly api: ApiService) {}

  ngOnInit(){
    this.switchForm(this.page);
  }

  async switchForm(page: number){
    this.page = page;
    this.tabsData = { ...this.tabsData, page: page };
  }

}
