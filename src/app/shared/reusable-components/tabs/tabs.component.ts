import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {

  @Input() tabsData: any = {
    page: 1
  };
  
  @Output() switchForm = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.switch(this.tabsData.page)
  }

  switch(val: number) {
    this.tabsData.page = val;
    this.switchForm.emit(val);
  }

}