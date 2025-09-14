import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({ 
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  user:any;
  fetchedData:any = {};  
  attendanceChartData!: ChartConfiguration<'bar'>['data'];
  attendanceChartOptions: ChartConfiguration<'bar'>['options'] = {};
  
  constructor(private api: ApiService) { }

  async ngOnInit(){
    this.user = this.api.safeJSONParse('currUser')
    const neededData: any = ['dashboardInfo'];
    const data:any =  await this.api.fetchData([neededData])
    if(data){
      this.fetchedData = data?.dashboardInfo;
      this.setCharts()
    }
    this.user = await this.api.safeJSONParse('currUser');
  }

  setCharts(){
    this.attendanceChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Attendance',
          data: this.fetchedData?.analytics?.attendanceTrends,
          backgroundColor: [ '#16A34A', '#FACC15', '#D1D5DB', '#16A34A', '#FACC15', '#D1D5DB'],
          borderRadius: 8,
        }
      ]
    };
    this.attendanceChartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#6B7280' },
          grid: { color: '#E5E7EB' }
        },
        x: {
          ticks: { color: '#6B7280' },
          grid: { display: false }
        }
      }
    };
  }

}
