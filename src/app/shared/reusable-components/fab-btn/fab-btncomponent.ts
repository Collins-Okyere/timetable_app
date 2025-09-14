import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-fab-btn',
  templateUrl: './fab-btn.component.html',
  styleUrls: ['./fab-btn.component.scss']
})
export class FabBtnComponent {
  
  @Input() fabData:any = {
    icon: {
      color: 'white'
    },
    tooltip: '',
    bgColor: 'bg-emerald-800'
  };
  @Output() clicked = new EventEmitter<void>();

  isHovered: boolean = false;

  onClick(): void {
    this.clicked.emit();
  }

}
