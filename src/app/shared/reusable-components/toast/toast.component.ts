import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  
  toastData: any = {
    message: '',
    status: '',
    isVisible: false,
    showIcon: true,
    showCloseBtn: true,
    link: null,
  };
  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe((data) => {
      if (data) {
        this.toastData = { ...data, isVisible: true, showIcon: true, showCloseBtn: true, };
        setTimeout(() => this.dismissToast(), 3000); // Auto-hide after 5 sec
      }
    });
  }

  dismissToast() {
    this.toastData.isVisible = false;
  }


}